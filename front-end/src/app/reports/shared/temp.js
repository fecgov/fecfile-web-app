'use strict';
import { default as func2 } from './ucs2length.js';
export const Contact_Individual = validate10;
const schema11 = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  $id: 'https://github.com/fecgov/fecfile-validate/blob/main/schema/Contact_Individual.json',
  version: 'v0.0.0.0',
  title: 'FEC Individual',
  type: 'object',
  required: ['type', 'last_name', 'first_name', 'street_1', 'city', 'state', 'country'],
  fec_recommended: [],
  properties: {
    type: { const: 'IND' },
    last_name: { type: 'string', minLength: 1, maxLength: 30, pattern: '^[ -~]{0,30}$' },
    first_name: { type: 'string', minLength: 1, maxLength: 20, pattern: '^[ -~]{0,20}$' },
    middle_name: { type: ['string', 'null'], minLength: 0, maxLength: 20, pattern: '^[ -~]{0,20}$' },
    prefix: { type: ['string', 'null'], minLength: 0, maxLength: 10, pattern: '^[ -~]{0,10}$' },
    suffix: { type: ['string', 'null'], minLength: 0, maxLength: 10, pattern: '^[ -~]{0,10}$' },
    street_1: { type: 'string', minLength: 1, maxLength: 34, pattern: '^[ -~]{0,34}$' },
    street_2: { type: ['string', 'null'], minLength: 0, maxLength: 34, pattern: '^[ -~]{0,34}$' },
    city: { type: 'string', minLength: 1, maxLength: 30, pattern: '^[ -~]{0,30}$' },
    state: { type: 'string', minLength: 1, maxLength: 2, pattern: '^[ -~]{0,2}$' },
    zip: { type: ['string', 'null'], minLength: 0, maxLength: 9, pattern: '^[ -~]{0,9}$' },
    telephone: { type: ['string', 'null'], pattern: '^\\+\\d{1,3} \\d{10}$' },
    employer: { type: ['string', 'null'], minLength: 0, maxLength: 38, pattern: '^[ -~]{0,38}$' },
    occupation: { type: ['string', 'null'], minLength: 0, maxLength: 38, pattern: '^[ -~]{0,38}$' },
    country: { type: 'string' },
  },
  allOf: [
    {
      if: { properties: { country: { const: 'USA' } }, required: ['country'] },
      then: { required: ['zip'], properties: { zip: { type: 'string' } } },
    },
  ],
};
const pattern0 = new RegExp('^[ -~]{0,30}$', 'u');
const pattern1 = new RegExp('^[ -~]{0,20}$', 'u');
const pattern3 = new RegExp('^[ -~]{0,10}$', 'u');
const pattern5 = new RegExp('^[ -~]{0,34}$', 'u');
const pattern8 = new RegExp('^[ -~]{0,2}$', 'u');
const pattern9 = new RegExp('^[ -~]{0,9}$', 'u');
const pattern10 = new RegExp('^\\+\\d{1,3} \\d{10}$', 'u');
const pattern11 = new RegExp('^[ -~]{0,38}$', 'u');

function validate10(data, { instancePath = '', parentData, parentDataProperty, rootData = data } = {}) {
  /*# sourceURL="https://github.com/fecgov/fecfile-validate/blob/main/schema/Contact_Individual.json" */ let vErrors =
    null;
  let errors = 0;
  const _errs2 = errors;
  let valid1 = true;
  const _errs3 = errors;
  if (data && typeof data == 'object' && !Array.isArray(data)) {
    let missing0;
    if (data.country === undefined && (missing0 = 'country')) {
      const err0 = {};
      if (vErrors === null) {
        vErrors = [err0];
      } else {
        vErrors.push(err0);
      }
      errors++;
    } else {
      if (data.country !== undefined) {
        if ('USA' !== data.country) {
          const err1 = {};
          if (vErrors === null) {
            vErrors = [err1];
          } else {
            vErrors.push(err1);
          }
          errors++;
        }
      }
    }
  }
  var _valid0 = _errs3 === errors;
  errors = _errs2;
  if (vErrors !== null) {
    if (_errs2) {
      vErrors.length = _errs2;
    } else {
      vErrors = null;
    }
  }
  if (_valid0) {
    const _errs5 = errors;
    if (data && typeof data == 'object' && !Array.isArray(data)) {
      if (data.zip === undefined) {
        const err2 = {
          instancePath,
          schemaPath: '#/allOf/0/then/required',
          keyword: 'required',
          params: { missingProperty: 'zip' },
          message: "must have required property '" + 'zip' + "'",
        };
        if (vErrors === null) {
          vErrors = [err2];
        } else {
          vErrors.push(err2);
        }
        errors++;
      }
      if (data.zip !== undefined) {
        if (typeof data.zip !== 'string') {
          const err3 = {
            instancePath: instancePath + '/zip',
            schemaPath: '#/allOf/0/then/properties/zip/type',
            keyword: 'type',
            params: { type: 'string' },
            message: 'must be string',
          };
          if (vErrors === null) {
            vErrors = [err3];
          } else {
            vErrors.push(err3);
          }
          errors++;
        }
      }
    }
    var _valid0 = _errs5 === errors;
    valid1 = _valid0;
  }
  if (!valid1) {
    const err4 = {
      instancePath,
      schemaPath: '#/allOf/0/if',
      keyword: 'if',
      params: { failingKeyword: 'then' },
      message: 'must match "then" schema',
    };
    if (vErrors === null) {
      vErrors = [err4];
    } else {
      vErrors.push(err4);
    }
    errors++;
  }
  if (data && typeof data == 'object' && !Array.isArray(data)) {
    if (data.type === undefined) {
      const err5 = {
        instancePath,
        schemaPath: '#/required',
        keyword: 'required',
        params: { missingProperty: 'type' },
        message: "must have required property '" + 'type' + "'",
      };
      if (vErrors === null) {
        vErrors = [err5];
      } else {
        vErrors.push(err5);
      }
      errors++;
    }
    if (data.last_name === undefined) {
      const err6 = {
        instancePath,
        schemaPath: '#/required',
        keyword: 'required',
        params: { missingProperty: 'last_name' },
        message: "must have required property '" + 'last_name' + "'",
      };
      if (vErrors === null) {
        vErrors = [err6];
      } else {
        vErrors.push(err6);
      }
      errors++;
    }
    if (data.first_name === undefined) {
      const err7 = {
        instancePath,
        schemaPath: '#/required',
        keyword: 'required',
        params: { missingProperty: 'first_name' },
        message: "must have required property '" + 'first_name' + "'",
      };
      if (vErrors === null) {
        vErrors = [err7];
      } else {
        vErrors.push(err7);
      }
      errors++;
    }
    if (data.street_1 === undefined) {
      const err8 = {
        instancePath,
        schemaPath: '#/required',
        keyword: 'required',
        params: { missingProperty: 'street_1' },
        message: "must have required property '" + 'street_1' + "'",
      };
      if (vErrors === null) {
        vErrors = [err8];
      } else {
        vErrors.push(err8);
      }
      errors++;
    }
    if (data.city === undefined) {
      const err9 = {
        instancePath,
        schemaPath: '#/required',
        keyword: 'required',
        params: { missingProperty: 'city' },
        message: "must have required property '" + 'city' + "'",
      };
      if (vErrors === null) {
        vErrors = [err9];
      } else {
        vErrors.push(err9);
      }
      errors++;
    }
    if (data.state === undefined) {
      const err10 = {
        instancePath,
        schemaPath: '#/required',
        keyword: 'required',
        params: { missingProperty: 'state' },
        message: "must have required property '" + 'state' + "'",
      };
      if (vErrors === null) {
        vErrors = [err10];
      } else {
        vErrors.push(err10);
      }
      errors++;
    }
    if (data.country === undefined) {
      const err11 = {
        instancePath,
        schemaPath: '#/required',
        keyword: 'required',
        params: { missingProperty: 'country' },
        message: "must have required property '" + 'country' + "'",
      };
      if (vErrors === null) {
        vErrors = [err11];
      } else {
        vErrors.push(err11);
      }
      errors++;
    }
    if (data.type !== undefined) {
      if ('IND' !== data.type) {
        const err12 = {
          instancePath: instancePath + '/type',
          schemaPath: '#/properties/type/const',
          keyword: 'const',
          params: { allowedValue: 'IND' },
          message: 'must be equal to constant',
        };
        if (vErrors === null) {
          vErrors = [err12];
        } else {
          vErrors.push(err12);
        }
        errors++;
      }
    }
    if (data.last_name !== undefined) {
      let data3 = data.last_name;
      if (typeof data3 === 'string') {
        if (func2(data3) > 30) {
          const err13 = {
            instancePath: instancePath + '/last_name',
            schemaPath: '#/properties/last_name/maxLength',
            keyword: 'maxLength',
            params: { limit: 30 },
            message: 'must NOT have more than 30 characters',
          };
          if (vErrors === null) {
            vErrors = [err13];
          } else {
            vErrors.push(err13);
          }
          errors++;
        }
        if (func2(data3) < 1) {
          const err14 = {
            instancePath: instancePath + '/last_name',
            schemaPath: '#/properties/last_name/minLength',
            keyword: 'minLength',
            params: { limit: 1 },
            message: 'must NOT have fewer than 1 characters',
          };
          if (vErrors === null) {
            vErrors = [err14];
          } else {
            vErrors.push(err14);
          }
          errors++;
        }
        if (!pattern0.test(data3)) {
          const err15 = {
            instancePath: instancePath + '/last_name',
            schemaPath: '#/properties/last_name/pattern',
            keyword: 'pattern',
            params: { pattern: '^[ -~]{0,30}$' },
            message: 'must match pattern "' + '^[ -~]{0,30}$' + '"',
          };
          if (vErrors === null) {
            vErrors = [err15];
          } else {
            vErrors.push(err15);
          }
          errors++;
        }
      } else {
        const err16 = {
          instancePath: instancePath + '/last_name',
          schemaPath: '#/properties/last_name/type',
          keyword: 'type',
          params: { type: 'string' },
          message: 'must be string',
        };
        if (vErrors === null) {
          vErrors = [err16];
        } else {
          vErrors.push(err16);
        }
        errors++;
      }
    }
    if (data.first_name !== undefined) {
      let data4 = data.first_name;
      if (typeof data4 === 'string') {
        if (func2(data4) > 20) {
          const err17 = {
            instancePath: instancePath + '/first_name',
            schemaPath: '#/properties/first_name/maxLength',
            keyword: 'maxLength',
            params: { limit: 20 },
            message: 'must NOT have more than 20 characters',
          };
          if (vErrors === null) {
            vErrors = [err17];
          } else {
            vErrors.push(err17);
          }
          errors++;
        }
        if (func2(data4) < 1) {
          const err18 = {
            instancePath: instancePath + '/first_name',
            schemaPath: '#/properties/first_name/minLength',
            keyword: 'minLength',
            params: { limit: 1 },
            message: 'must NOT have fewer than 1 characters',
          };
          if (vErrors === null) {
            vErrors = [err18];
          } else {
            vErrors.push(err18);
          }
          errors++;
        }
        if (!pattern1.test(data4)) {
          const err19 = {
            instancePath: instancePath + '/first_name',
            schemaPath: '#/properties/first_name/pattern',
            keyword: 'pattern',
            params: { pattern: '^[ -~]{0,20}$' },
            message: 'must match pattern "' + '^[ -~]{0,20}$' + '"',
          };
          if (vErrors === null) {
            vErrors = [err19];
          } else {
            vErrors.push(err19);
          }
          errors++;
        }
      } else {
        const err20 = {
          instancePath: instancePath + '/first_name',
          schemaPath: '#/properties/first_name/type',
          keyword: 'type',
          params: { type: 'string' },
          message: 'must be string',
        };
        if (vErrors === null) {
          vErrors = [err20];
        } else {
          vErrors.push(err20);
        }
        errors++;
      }
    }
    if (data.middle_name !== undefined) {
      let data5 = data.middle_name;
      if (typeof data5 !== 'string' && data5 !== null) {
        const err21 = {
          instancePath: instancePath + '/middle_name',
          schemaPath: '#/properties/middle_name/type',
          keyword: 'type',
          params: { type: schema11.properties.middle_name.type },
          message: 'must be string,null',
        };
        if (vErrors === null) {
          vErrors = [err21];
        } else {
          vErrors.push(err21);
        }
        errors++;
      }
      if (typeof data5 === 'string') {
        if (func2(data5) > 20) {
          const err22 = {
            instancePath: instancePath + '/middle_name',
            schemaPath: '#/properties/middle_name/maxLength',
            keyword: 'maxLength',
            params: { limit: 20 },
            message: 'must NOT have more than 20 characters',
          };
          if (vErrors === null) {
            vErrors = [err22];
          } else {
            vErrors.push(err22);
          }
          errors++;
        }
        if (func2(data5) < 0) {
          const err23 = {
            instancePath: instancePath + '/middle_name',
            schemaPath: '#/properties/middle_name/minLength',
            keyword: 'minLength',
            params: { limit: 0 },
            message: 'must NOT have fewer than 0 characters',
          };
          if (vErrors === null) {
            vErrors = [err23];
          } else {
            vErrors.push(err23);
          }
          errors++;
        }
        if (!pattern1.test(data5)) {
          const err24 = {
            instancePath: instancePath + '/middle_name',
            schemaPath: '#/properties/middle_name/pattern',
            keyword: 'pattern',
            params: { pattern: '^[ -~]{0,20}$' },
            message: 'must match pattern "' + '^[ -~]{0,20}$' + '"',
          };
          if (vErrors === null) {
            vErrors = [err24];
          } else {
            vErrors.push(err24);
          }
          errors++;
        }
      }
    }
    if (data.prefix !== undefined) {
      let data6 = data.prefix;
      if (typeof data6 !== 'string' && data6 !== null) {
        const err25 = {
          instancePath: instancePath + '/prefix',
          schemaPath: '#/properties/prefix/type',
          keyword: 'type',
          params: { type: schema11.properties.prefix.type },
          message: 'must be string,null',
        };
        if (vErrors === null) {
          vErrors = [err25];
        } else {
          vErrors.push(err25);
        }
        errors++;
      }
      if (typeof data6 === 'string') {
        if (func2(data6) > 10) {
          const err26 = {
            instancePath: instancePath + '/prefix',
            schemaPath: '#/properties/prefix/maxLength',
            keyword: 'maxLength',
            params: { limit: 10 },
            message: 'must NOT have more than 10 characters',
          };
          if (vErrors === null) {
            vErrors = [err26];
          } else {
            vErrors.push(err26);
          }
          errors++;
        }
        if (func2(data6) < 0) {
          const err27 = {
            instancePath: instancePath + '/prefix',
            schemaPath: '#/properties/prefix/minLength',
            keyword: 'minLength',
            params: { limit: 0 },
            message: 'must NOT have fewer than 0 characters',
          };
          if (vErrors === null) {
            vErrors = [err27];
          } else {
            vErrors.push(err27);
          }
          errors++;
        }
        if (!pattern3.test(data6)) {
          const err28 = {
            instancePath: instancePath + '/prefix',
            schemaPath: '#/properties/prefix/pattern',
            keyword: 'pattern',
            params: { pattern: '^[ -~]{0,10}$' },
            message: 'must match pattern "' + '^[ -~]{0,10}$' + '"',
          };
          if (vErrors === null) {
            vErrors = [err28];
          } else {
            vErrors.push(err28);
          }
          errors++;
        }
      }
    }
    if (data.suffix !== undefined) {
      let data7 = data.suffix;
      if (typeof data7 !== 'string' && data7 !== null) {
        const err29 = {
          instancePath: instancePath + '/suffix',
          schemaPath: '#/properties/suffix/type',
          keyword: 'type',
          params: { type: schema11.properties.suffix.type },
          message: 'must be string,null',
        };
        if (vErrors === null) {
          vErrors = [err29];
        } else {
          vErrors.push(err29);
        }
        errors++;
      }
      if (typeof data7 === 'string') {
        if (func2(data7) > 10) {
          const err30 = {
            instancePath: instancePath + '/suffix',
            schemaPath: '#/properties/suffix/maxLength',
            keyword: 'maxLength',
            params: { limit: 10 },
            message: 'must NOT have more than 10 characters',
          };
          if (vErrors === null) {
            vErrors = [err30];
          } else {
            vErrors.push(err30);
          }
          errors++;
        }
        if (func2(data7) < 0) {
          const err31 = {
            instancePath: instancePath + '/suffix',
            schemaPath: '#/properties/suffix/minLength',
            keyword: 'minLength',
            params: { limit: 0 },
            message: 'must NOT have fewer than 0 characters',
          };
          if (vErrors === null) {
            vErrors = [err31];
          } else {
            vErrors.push(err31);
          }
          errors++;
        }
        if (!pattern3.test(data7)) {
          const err32 = {
            instancePath: instancePath + '/suffix',
            schemaPath: '#/properties/suffix/pattern',
            keyword: 'pattern',
            params: { pattern: '^[ -~]{0,10}$' },
            message: 'must match pattern "' + '^[ -~]{0,10}$' + '"',
          };
          if (vErrors === null) {
            vErrors = [err32];
          } else {
            vErrors.push(err32);
          }
          errors++;
        }
      }
    }
    if (data.street_1 !== undefined) {
      let data8 = data.street_1;
      if (typeof data8 === 'string') {
        if (func2(data8) > 34) {
          const err33 = {
            instancePath: instancePath + '/street_1',
            schemaPath: '#/properties/street_1/maxLength',
            keyword: 'maxLength',
            params: { limit: 34 },
            message: 'must NOT have more than 34 characters',
          };
          if (vErrors === null) {
            vErrors = [err33];
          } else {
            vErrors.push(err33);
          }
          errors++;
        }
        if (func2(data8) < 1) {
          const err34 = {
            instancePath: instancePath + '/street_1',
            schemaPath: '#/properties/street_1/minLength',
            keyword: 'minLength',
            params: { limit: 1 },
            message: 'must NOT have fewer than 1 characters',
          };
          if (vErrors === null) {
            vErrors = [err34];
          } else {
            vErrors.push(err34);
          }
          errors++;
        }
        if (!pattern5.test(data8)) {
          const err35 = {
            instancePath: instancePath + '/street_1',
            schemaPath: '#/properties/street_1/pattern',
            keyword: 'pattern',
            params: { pattern: '^[ -~]{0,34}$' },
            message: 'must match pattern "' + '^[ -~]{0,34}$' + '"',
          };
          if (vErrors === null) {
            vErrors = [err35];
          } else {
            vErrors.push(err35);
          }
          errors++;
        }
      } else {
        const err36 = {
          instancePath: instancePath + '/street_1',
          schemaPath: '#/properties/street_1/type',
          keyword: 'type',
          params: { type: 'string' },
          message: 'must be string',
        };
        if (vErrors === null) {
          vErrors = [err36];
        } else {
          vErrors.push(err36);
        }
        errors++;
      }
    }
    if (data.street_2 !== undefined) {
      let data9 = data.street_2;
      if (typeof data9 !== 'string' && data9 !== null) {
        const err37 = {
          instancePath: instancePath + '/street_2',
          schemaPath: '#/properties/street_2/type',
          keyword: 'type',
          params: { type: schema11.properties.street_2.type },
          message: 'must be string,null',
        };
        if (vErrors === null) {
          vErrors = [err37];
        } else {
          vErrors.push(err37);
        }
        errors++;
      }
      if (typeof data9 === 'string') {
        if (func2(data9) > 34) {
          const err38 = {
            instancePath: instancePath + '/street_2',
            schemaPath: '#/properties/street_2/maxLength',
            keyword: 'maxLength',
            params: { limit: 34 },
            message: 'must NOT have more than 34 characters',
          };
          if (vErrors === null) {
            vErrors = [err38];
          } else {
            vErrors.push(err38);
          }
          errors++;
        }
        if (func2(data9) < 0) {
          const err39 = {
            instancePath: instancePath + '/street_2',
            schemaPath: '#/properties/street_2/minLength',
            keyword: 'minLength',
            params: { limit: 0 },
            message: 'must NOT have fewer than 0 characters',
          };
          if (vErrors === null) {
            vErrors = [err39];
          } else {
            vErrors.push(err39);
          }
          errors++;
        }
        if (!pattern5.test(data9)) {
          const err40 = {
            instancePath: instancePath + '/street_2',
            schemaPath: '#/properties/street_2/pattern',
            keyword: 'pattern',
            params: { pattern: '^[ -~]{0,34}$' },
            message: 'must match pattern "' + '^[ -~]{0,34}$' + '"',
          };
          if (vErrors === null) {
            vErrors = [err40];
          } else {
            vErrors.push(err40);
          }
          errors++;
        }
      }
    }
    if (data.city !== undefined) {
      let data10 = data.city;
      if (typeof data10 === 'string') {
        if (func2(data10) > 30) {
          const err41 = {
            instancePath: instancePath + '/city',
            schemaPath: '#/properties/city/maxLength',
            keyword: 'maxLength',
            params: { limit: 30 },
            message: 'must NOT have more than 30 characters',
          };
          if (vErrors === null) {
            vErrors = [err41];
          } else {
            vErrors.push(err41);
          }
          errors++;
        }
        if (func2(data10) < 1) {
          const err42 = {
            instancePath: instancePath + '/city',
            schemaPath: '#/properties/city/minLength',
            keyword: 'minLength',
            params: { limit: 1 },
            message: 'must NOT have fewer than 1 characters',
          };
          if (vErrors === null) {
            vErrors = [err42];
          } else {
            vErrors.push(err42);
          }
          errors++;
        }
        if (!pattern0.test(data10)) {
          const err43 = {
            instancePath: instancePath + '/city',
            schemaPath: '#/properties/city/pattern',
            keyword: 'pattern',
            params: { pattern: '^[ -~]{0,30}$' },
            message: 'must match pattern "' + '^[ -~]{0,30}$' + '"',
          };
          if (vErrors === null) {
            vErrors = [err43];
          } else {
            vErrors.push(err43);
          }
          errors++;
        }
      } else {
        const err44 = {
          instancePath: instancePath + '/city',
          schemaPath: '#/properties/city/type',
          keyword: 'type',
          params: { type: 'string' },
          message: 'must be string',
        };
        if (vErrors === null) {
          vErrors = [err44];
        } else {
          vErrors.push(err44);
        }
        errors++;
      }
    }
    if (data.state !== undefined) {
      let data11 = data.state;
      if (typeof data11 === 'string') {
        if (func2(data11) > 2) {
          const err45 = {
            instancePath: instancePath + '/state',
            schemaPath: '#/properties/state/maxLength',
            keyword: 'maxLength',
            params: { limit: 2 },
            message: 'must NOT have more than 2 characters',
          };
          if (vErrors === null) {
            vErrors = [err45];
          } else {
            vErrors.push(err45);
          }
          errors++;
        }
        if (func2(data11) < 1) {
          const err46 = {
            instancePath: instancePath + '/state',
            schemaPath: '#/properties/state/minLength',
            keyword: 'minLength',
            params: { limit: 1 },
            message: 'must NOT have fewer than 1 characters',
          };
          if (vErrors === null) {
            vErrors = [err46];
          } else {
            vErrors.push(err46);
          }
          errors++;
        }
        if (!pattern8.test(data11)) {
          const err47 = {
            instancePath: instancePath + '/state',
            schemaPath: '#/properties/state/pattern',
            keyword: 'pattern',
            params: { pattern: '^[ -~]{0,2}$' },
            message: 'must match pattern "' + '^[ -~]{0,2}$' + '"',
          };
          if (vErrors === null) {
            vErrors = [err47];
          } else {
            vErrors.push(err47);
          }
          errors++;
        }
      } else {
        const err48 = {
          instancePath: instancePath + '/state',
          schemaPath: '#/properties/state/type',
          keyword: 'type',
          params: { type: 'string' },
          message: 'must be string',
        };
        if (vErrors === null) {
          vErrors = [err48];
        } else {
          vErrors.push(err48);
        }
        errors++;
      }
    }
    if (data.zip !== undefined) {
      let data12 = data.zip;
      if (typeof data12 !== 'string' && data12 !== null) {
        const err49 = {
          instancePath: instancePath + '/zip',
          schemaPath: '#/properties/zip/type',
          keyword: 'type',
          params: { type: schema11.properties.zip.type },
          message: 'must be string,null',
        };
        if (vErrors === null) {
          vErrors = [err49];
        } else {
          vErrors.push(err49);
        }
        errors++;
      }
      if (typeof data12 === 'string') {
        if (func2(data12) > 9) {
          const err50 = {
            instancePath: instancePath + '/zip',
            schemaPath: '#/properties/zip/maxLength',
            keyword: 'maxLength',
            params: { limit: 9 },
            message: 'must NOT have more than 9 characters',
          };
          if (vErrors === null) {
            vErrors = [err50];
          } else {
            vErrors.push(err50);
          }
          errors++;
        }
        if (func2(data12) < 0) {
          const err51 = {
            instancePath: instancePath + '/zip',
            schemaPath: '#/properties/zip/minLength',
            keyword: 'minLength',
            params: { limit: 0 },
            message: 'must NOT have fewer than 0 characters',
          };
          if (vErrors === null) {
            vErrors = [err51];
          } else {
            vErrors.push(err51);
          }
          errors++;
        }
        if (!pattern9.test(data12)) {
          const err52 = {
            instancePath: instancePath + '/zip',
            schemaPath: '#/properties/zip/pattern',
            keyword: 'pattern',
            params: { pattern: '^[ -~]{0,9}$' },
            message: 'must match pattern "' + '^[ -~]{0,9}$' + '"',
          };
          if (vErrors === null) {
            vErrors = [err52];
          } else {
            vErrors.push(err52);
          }
          errors++;
        }
      }
    }
    if (data.telephone !== undefined) {
      let data13 = data.telephone;
      if (typeof data13 !== 'string' && data13 !== null) {
        const err53 = {
          instancePath: instancePath + '/telephone',
          schemaPath: '#/properties/telephone/type',
          keyword: 'type',
          params: { type: schema11.properties.telephone.type },
          message: 'must be string,null',
        };
        if (vErrors === null) {
          vErrors = [err53];
        } else {
          vErrors.push(err53);
        }
        errors++;
      }
      if (typeof data13 === 'string') {
        if (!pattern10.test(data13)) {
          const err54 = {
            instancePath: instancePath + '/telephone',
            schemaPath: '#/properties/telephone/pattern',
            keyword: 'pattern',
            params: { pattern: '^\\+\\d{1,3} \\d{10}$' },
            message: 'must match pattern "' + '^\\+\\d{1,3} \\d{10}$' + '"',
          };
          if (vErrors === null) {
            vErrors = [err54];
          } else {
            vErrors.push(err54);
          }
          errors++;
        }
      }
    }
    if (data.employer !== undefined) {
      let data14 = data.employer;
      if (typeof data14 !== 'string' && data14 !== null) {
        const err55 = {
          instancePath: instancePath + '/employer',
          schemaPath: '#/properties/employer/type',
          keyword: 'type',
          params: { type: schema11.properties.employer.type },
          message: 'must be string,null',
        };
        if (vErrors === null) {
          vErrors = [err55];
        } else {
          vErrors.push(err55);
        }
        errors++;
      }
      if (typeof data14 === 'string') {
        if (func2(data14) > 38) {
          const err56 = {
            instancePath: instancePath + '/employer',
            schemaPath: '#/properties/employer/maxLength',
            keyword: 'maxLength',
            params: { limit: 38 },
            message: 'must NOT have more than 38 characters',
          };
          if (vErrors === null) {
            vErrors = [err56];
          } else {
            vErrors.push(err56);
          }
          errors++;
        }
        if (func2(data14) < 0) {
          const err57 = {
            instancePath: instancePath + '/employer',
            schemaPath: '#/properties/employer/minLength',
            keyword: 'minLength',
            params: { limit: 0 },
            message: 'must NOT have fewer than 0 characters',
          };
          if (vErrors === null) {
            vErrors = [err57];
          } else {
            vErrors.push(err57);
          }
          errors++;
        }
        if (!pattern11.test(data14)) {
          const err58 = {
            instancePath: instancePath + '/employer',
            schemaPath: '#/properties/employer/pattern',
            keyword: 'pattern',
            params: { pattern: '^[ -~]{0,38}$' },
            message: 'must match pattern "' + '^[ -~]{0,38}$' + '"',
          };
          if (vErrors === null) {
            vErrors = [err58];
          } else {
            vErrors.push(err58);
          }
          errors++;
        }
      }
    }
    if (data.occupation !== undefined) {
      let data15 = data.occupation;
      if (typeof data15 !== 'string' && data15 !== null) {
        const err59 = {
          instancePath: instancePath + '/occupation',
          schemaPath: '#/properties/occupation/type',
          keyword: 'type',
          params: { type: schema11.properties.occupation.type },
          message: 'must be string,null',
        };
        if (vErrors === null) {
          vErrors = [err59];
        } else {
          vErrors.push(err59);
        }
        errors++;
      }
      if (typeof data15 === 'string') {
        if (func2(data15) > 38) {
          const err60 = {
            instancePath: instancePath + '/occupation',
            schemaPath: '#/properties/occupation/maxLength',
            keyword: 'maxLength',
            params: { limit: 38 },
            message: 'must NOT have more than 38 characters',
          };
          if (vErrors === null) {
            vErrors = [err60];
          } else {
            vErrors.push(err60);
          }
          errors++;
        }
        if (func2(data15) < 0) {
          const err61 = {
            instancePath: instancePath + '/occupation',
            schemaPath: '#/properties/occupation/minLength',
            keyword: 'minLength',
            params: { limit: 0 },
            message: 'must NOT have fewer than 0 characters',
          };
          if (vErrors === null) {
            vErrors = [err61];
          } else {
            vErrors.push(err61);
          }
          errors++;
        }
        if (!pattern11.test(data15)) {
          const err62 = {
            instancePath: instancePath + '/occupation',
            schemaPath: '#/properties/occupation/pattern',
            keyword: 'pattern',
            params: { pattern: '^[ -~]{0,38}$' },
            message: 'must match pattern "' + '^[ -~]{0,38}$' + '"',
          };
          if (vErrors === null) {
            vErrors = [err62];
          } else {
            vErrors.push(err62);
          }
          errors++;
        }
      }
    }
    if (data.country !== undefined) {
      if (typeof data.country !== 'string') {
        const err63 = {
          instancePath: instancePath + '/country',
          schemaPath: '#/properties/country/type',
          keyword: 'type',
          params: { type: 'string' },
          message: 'must be string',
        };
        if (vErrors === null) {
          vErrors = [err63];
        } else {
          vErrors.push(err63);
        }
        errors++;
      }
    }
  } else {
    const err64 = {
      instancePath,
      schemaPath: '#/type',
      keyword: 'type',
      params: { type: 'object' },
      message: 'must be object',
    };
    if (vErrors === null) {
      vErrors = [err64];
    } else {
      vErrors.push(err64);
    }
    errors++;
  }
  validate10.errors = vErrors;
  return errors === 0;
}
