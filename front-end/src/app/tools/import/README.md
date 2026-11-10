# Contacts import UI

Tools → Import uses /api/v1/contacts/imports/start/, polls the job, and offers
confirmation only after all rows validate. An invalid row blocks the entire
import. Job errors and a preview of up to 100 contacts are displayed. Uploads
and results are retained by the API; reloading does not cancel a background job.
After a network error, retry the status check before trying confirmation again.
The downloadable CSV has fictional examples for all four contact types; replace
or remove example rows before importing real data.

See fecfile-web-api/django-backend/fecfiler/contacts/imports/README.md for the
CSV contract, server setup, permissions, and atomicity behavior.
