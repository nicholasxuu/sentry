import {mapErrors} from 'sentry/views/dashboardsV2/widgetBuilder/eventWidget/utils';

describe('eventWidget utils', function () {
  describe('mapErrors', function () {
    it('able to handle string and string[] validation errors', () => {
      const flatValidation = mapErrors(
        {
          queries: [{fields: 'just a string'}],
          another: [{fields: ['another string']}],
        },
        {}
      );
      expect(flatValidation).toEqual({
        queries: [{fields: 'just a string'}],
        another: [{fields: 'another string'}],
      });
    });
  });
});
