/* eslint-disable @typescript-eslint/no-explicit-any */
import { BaseModel } from 'app/shared/models/base.model';
import { Expose, Transform, Type, instanceToPlain, plainToInstance } from 'class-transformer';

type OfficeType = 'House' | 'Presidential' | 'Senate';
type ElectionType = 'General' | 'Special';

export class Coverage {
  @Expose({ name: 'start_date' })
  @Transform(BaseModel.dateTransform)
  startDate!: Date | null;

  @Expose({ name: 'end_date' })
  @Transform(BaseModel.dateTransform)
  endDate!: Date | null;
}

export class ElectionCycle extends BaseModel {
  @Expose()
  id!: string;

  @Expose()
  office!: OfficeType | null;

  @Expose({ name: 'election_type' })
  electionType!: ElectionType | null;

  @Expose({ name: 'election_year' })
  electionYear!: string;

  @Expose()
  @Type(() => Coverage)
  @Transform(({ obj }) => plainToInstance(Coverage, obj, { excludeExtraneousValues: true }), {
    toClassOnly: true,
  })
  coverage!: Coverage;

  constructor(init?: Partial<ElectionCycle>) {
    super();
    if (init) {
      Object.assign(this, init);
    }
  }

  override toJson() {
    const { coverage, ...plain } = instanceToPlain(this, {
      enableCircularCheck: true,
      exposeUnsetFields: false,
    }) as Record<string, any>;

    const plainCoverage = coverage ? instanceToPlain(coverage) : {};
    return { ...plain, ...plainCoverage };
  }

  static fromJson(json: Record<string, any>): ElectionCycle {
    return plainToInstance(ElectionCycle, json, {
      excludeExtraneousValues: true,
    });
  }

  // Creates empty ElectinCycle with dummy id in order to work with PrimeNG's
  // table row edit. It uses the ID as a row key to determine what row is being edited
  static createEmpty(): ElectionCycle {
    return new ElectionCycle({ id: 'initial' });
  }
}
