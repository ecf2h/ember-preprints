import { moduleFor, test } from 'ember-qunit';

moduleFor('route:provider/content', 'Unit | Route | provider/content', {
  // Specify the other units that are required for this test.
    needs: [
        'controller:submit',
        'route:content',
        'service:metrics',
        'service:theme'
    ]
});

test('it exists', function(assert) {
  let route = this.subject();
  assert.ok(route);
});
