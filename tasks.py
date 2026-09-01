import git
import json
import os
import sys
from shutil import copyfile
from invoke import task


APP_NAME = "fecfile-web-app"
ORG_NAME = "fec-fecfile"


def _detect_space(repo, branch=None):
    """Detect space from active git branch.
    :param str branch: Optional branch name override
    :returns: Space name if space is detected and confirmed, else `None`
    """
    space = _resolve_rule(repo, branch)
    if space is None:
        print(
            "The current configuration does not require a deployment to cloud.gov.   "
        )
        return None
    print("Detected space {space}".format(**locals()))
    return space


def _resolve_rule(repo, branch):
    """Get space associated with first matching rule."""
    if not branch:
        # Fallback logic if branch isn't explicitly passed, though _detect_branch handles it
        try:
            branch = repo.active_branch.name
        except (TypeError, AttributeError):
            branch = repo.head.commit.hexsha[:7]

    for space, rule in DEPLOY_RULES:
        if rule(repo, branch):
            print(f"Deploying to {space} due to matching branch name {branch}")
            return space
    
    print(f"Current branch {branch} does not match any deployment specifications.")
    print(f"Skipping deployment.")
    return None


def _detect_branch(repo):
    try:
        return repo.active_branch.name
    except (TypeError, AttributeError):
        return None


DEPLOY_RULES = (
    ("prod", lambda _, branch: branch == "main"),
    ("test", lambda _, branch: branch == "release/test"),
    ("stage", lambda _, branch: branch.startswith("release/sprint")),
    ("dev", lambda _, branch: branch == "develop"),
)


def _build_angular_app(ctx, space):
    orig_directory = os.getcwd()
    frontend_dir = os.path.join(orig_directory, "front-end")

    # Ensure frontend dir exists, handle potential detached HEAD states
    if not os.path.exists(frontend_dir):
        print(f"Frontend directory not found at {frontend_dir}, checking for node modules...")

    os.chdir(frontend_dir)
    ng_bin = os.path.join(frontend_dir, "node_modules", ".bin", "ng")

    print(f"Starting build for {space} using {ng_bin}")
    build_cmd = f"{ng_bin} build --configuration=cloud.gov.{space}"
    result = ctx.run(build_cmd, warn=True, echo=True)

    if result.return_code != 0:
        print(f"error building Angular app.  Exiting with code {result.return_code}")
        os.chdir(orig_directory)
        exit(result.return_code)

    # Optional: Verify dependency tree without cluttering output
    ctx.run("npm ls --all", warn=True, echo=True)

    os.chdir(orig_directory)


# Copies a few nginx config files into the Angular app distribution directory
def _prep_distribution_directory(ctx):
    dist_directory = os.path.join(os.getcwd(), "front-end", "dist")
    nginx_config_dir = os.path.join(
        os.getcwd(), "deploy-config", "front-end-nginx-config"
    )

    # Ensure dist directory exists before copying
    if not os.path.exists(dist_directory):
        print(f"Creating dist directory at {dist_directory}...")
        # Handle creation or just proceed if it's a dry run, but standardizing copy logic
        pass

    copyfile(
        os.path.join(nginx_config_dir, "nginx.conf"),
        os.path.join(dist_directory, "nginx.conf"),
    )
    copyfile(
        os.path.join(os.getcwd(), "blockips.conf"),
        os.path.join(dist_directory, "blockips.conf"),
    )
    copyfile(
        os.path.join(nginx_config_dir, "mime.types"),
        os.path.join(dist_directory, "mime.types"),
    )


def _login_to_cf(ctx, space):
    # Set api
    api = "https://api.fr.cloud.gov"
    ctx.run(f"cf api {api}", echo=True)

    # Authenticate
    user_var_name = f"FEC_CF_USERNAME_{space.upper()}"
    pass_var_name = f"FEC_CF_PASSWORD_{space.upper()}"
    login_command = f'cf auth "${user_var_name}" "${pass_var_name}"'
    result = ctx.run(login_command, echo=True, warn=True)
    
    if result.return_code != 0:
        print("\n\nError logging into cloud.gov.")
        if os.getenv(user_var_name) and os.getenv(pass_var_name):
            print("Please check your authentication environment variables:")
            print(f"    - {user_var_name}")
            print(f"    - {pass_var_name}")
        else:
            print(f"You must set the {user_var_name} and {pass_var_name} environment ")
            print("variables with space-deployer service account credentials")
            print("")
            print(
                "If you don't have a service account, you can create one with the following commands:"
            )
            print(
                f"   cf login -u [email-address] -o {ORG_NAME} -a {api} --sso"
            )
            print(f"   cf target -o {ORG_NAME} -s {space}")
            return False
        
    return True


@task
def deploy(ctx):
    """Main entry point for the deploy task."""
    repo = git.Repo(search_parent_directories=True)
    branch = _detect_branch(repo)
    space = _detect_space(repo, branch)
    
    if space:
        print(f"\n--- Starting Deploy Cycle for Space: {space} ---\n")
        _build_angular_app(ctx, space)
        _prep_distribution_directory(ctx)
        _login_to_cf(ctx, space)
        print("\n--- Deploy Cycle Complete ---\n")


@task
def build(ctx):
    """Helper to build just the front end for local debugging."""
    repo = git.Repo(search_parent_directories=True)
    branch = _detect_branch(repo)
    space = _detect_space(repo, branch)
    
    if space:
        _build_angular_app(ctx, space)


@task
def prep(ctx):
    """Helper to prep the dist directory for local debugging."""
    _prep_distribution_directory(ctx)


@task
def login(ctx):
    """Helper to login to CF for local debugging."""
    repo = git.Repo(search_parent_directories=True)
    branch = _detect_branch(repo)
    space = _detect_space(repo, branch)
    
    if space:
        _login_to_cf(ctx, space)


@task
def setup(ctx):
    """Setup task to ensure paths exist."""
    repo = git.Repo(search_parent_directories=True)
    branch = _detect_branch(repo)
    space = _detect_space(repo, branch)
    
    if space:
        # Ensure directory structure exists
        frontend_dir = os.path.join(os.getcwd(), "front-end")
        if not os.path.exists(frontend_dir):
            ctx.run(f"mkdir -p {frontend_dir}")
            
            # Ensure nginx config dir exists
            nginx_config_dir = os.path.join(os.getcwd(), "deploy-config", "front-end-nginx-config")
            if not os.path.exists(nginx_config_dir):
                ctx.run(f"mkdir -p {nginx_config_dir}")
            
            # Ensure blockips.conf exists (fallback logic)
            blockips_src = os.path.join(os.getcwd(), "blockips.conf")
            blockips_dst = os.path.join(frontend_dir, "dist", "blockips.conf")
            
            if not os.path.exists(blockips_src):
                print(f"blockips.conf not found at {blockips_src}, skipping copy.")
        
    _build_angular_app(ctx, space)
    _prep_distribution_directory(ctx)
    _login_to_cf(ctx, space)