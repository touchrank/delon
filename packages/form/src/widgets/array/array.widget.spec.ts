import { DebugElement } from '@angular/core';
import { ComponentFixture } from '@angular/core/testing';
import { deepCopy } from '@delon/util';
import {
  builder,
  TestFormComponent,
  SFPage,
  SCHEMA,
} from '../../../spec/base.spec';
import { SFSchema } from '../../../src/schema/index';
import { SFUISchemaItem, SFUISchema } from '../../../src/schema/ui';

describe('form: widget: array', () => {
  let fixture: ComponentFixture<TestFormComponent>;
  let dl: DebugElement;
  let context: TestFormComponent;
  let page: SFPage;
  const maxItems = 3;
  const schema: SFSchema = {
    properties: {
      arr: {
        type: 'array',
        maxItems,
        items: {
          type: 'object',
          properties: {
            a: { type: 'string' },
          },
        },
      },
    },
  };

  beforeEach(() =>
    ({ fixture, dl, context, page } = builder({ detectChanges: false })));

  it('should be add item', () => {
    page
      .newSchema(schema)
      .checkCount('.sf-array-item', 0)
      .add()
      .checkCount('.sf-array-item', 1);
  });
  it(`should be maximum ${maxItems}`, () => {
    page
      .newSchema(schema)
      .add()
      .add()
      .add()
      .checkCount('.sf-array-item', maxItems)
      .add()
      .checkCount('.sf-array-item', maxItems);
  });
  it('should be set values', () => {
    page
      .newSchema(schema)
      .checkCount('.sf-array-item', 0)
      .add()
      .checkCount('.sf-array-item', 1)
      .setValue('/arr', [])
      .checkCount('.sf-array-item', 0);
  });
  describe('#removable', () => {
    it('with true', () => {
      const s = deepCopy(schema) as SFSchema;
      s.properties.arr.ui = { removable: true };
      page
        .newSchema(s)
        .checkCount('.sf-array-item', 0)
        .add()
        .checkCount('.sf-array-item', 1)
        .remove()
        .checkCount('.sf-array-item', 0);
    });
    it('with false', () => {
      const s = deepCopy(schema) as SFSchema;
      s.properties.arr.ui = { removable: false };
      page
        .newSchema(s)
        .checkCount('.sf-array-item', 0)
        .add()
        .checkCount('.sf-array-item', 1)
        .checkCount(`.sf-array-container [data-index="0"] .remove`, 0);
    });
  });
  describe('#default data', () => {
    it('via formData in sf component', () => {
      const data = {
        arr: [{ a: 'a1' }, { a: 'a2' }],
      };
      context.formData = data;
      page.newSchema(schema).checkCount('.sf-array-item', data.arr.length);
    });
    it('via default in schema', () => {
      const data = [{ a: 'a1' }, { a: 'a2' }];
      const s = deepCopy(schema) as SFSchema;
      s.properties.arr.default = data;
      page.newSchema(s).checkCount('.sf-array-item', data.length);
    });
    it('should be keeping default value in reset action', () => {
      const data = [{ a: 'a1' }, { a: 'a2' }];
      const s = deepCopy(schema) as SFSchema;
      s.properties.arr.default = data;
      page.newSchema(s)
          .checkCount('.sf-array-item', data.length)
          .add()
          .checkCount('.sf-array-item', data.length + 1)
          .reset()
          .checkCount('.sf-array-item', data.length)
          ;
    });
  });
});
