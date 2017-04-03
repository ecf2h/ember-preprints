import {moduleFor, test} from 'ember-qunit';

import config from 'ember-get-config';

moduleFor('controller:content', 'Unit | Controller | content', {
    needs: [
        'model:file',
        'model:file-version',
        'model:comment',
        'model:node',
        'model:preprint',
        'model:preprint-provider',
        'model:institution',
        'model:contributor',
        'model:file-provider',
        'model:registration',
        'model:draft-registration',
        'model:log',
        'model:user',
        'model:citation',
        'model:license',
        'model:wiki',
        'service:metrics',
        'service:theme'
    ]
});

test('Initial properties', function (assert) {
    const ctrl = this.subject();

    const expected = {
        fullScreenMFR: false,
        expandedAuthors: true,
        showLicenseText: false,
        fileDownloadURL: '',
        activeFile: null,
        chosenFile: null,
    };

    const propKeys = Object.keys(expected);
    const actual = ctrl.getProperties(propKeys);

    assert.ok(propKeys.every(key => expected[key] === actual[key]));
});

test('isAdmin computed property', function (assert) {
    this.inject.service('store');

    const store = this.store;
    const ctrl = this.subject();

    Ember.run(() => {
        const node = store.createRecord('node', {
            currentUserPermissions: ['admin']
        });

        assert.strictEqual(ctrl.get('isAdmin'), false);

        ctrl.set('node', node);

        assert.strictEqual(ctrl.get('isAdmin'), true);
    });
});

test('twitterHref computed property', function (assert) {
    this.inject.service('store');

    const store = this.store;
    const ctrl = this.subject();

    Ember.run(() => {
        const node = store.createRecord('node', {
            title: 'test title'
        });

        ctrl.setProperties({node});

        const location = encodeURIComponent(window.location.href);

        assert.strictEqual(
            ctrl.get('twitterHref'),
            `https://twitter.com/intent/tweet?url=${location}&text=test%20title&via=OSFramework`
        );
    });
});

test('facebookHref computed property', function (assert) {
    const ctrl = this.subject();

    const {FB_APP_ID} = config;
    const location = encodeURIComponent(window.location.href);

    assert.strictEqual(
        ctrl.get('facebookHref'),
        `https://www.facebook.com/dialog/share?app_id=${FB_APP_ID}&display=popup&href=${location}&redirect_uri=${location}`
    );
});

test('linkedinHref computed property', function (assert) {
    this.inject.service('store');

    const store = this.store;
    const ctrl = this.subject();

    Ember.run(() => {
        const node = store.createRecord('node', {
            title: 'test title',
            description: 'test description'
        });

        ctrl.setProperties({node});

        const location = encodeURIComponent(window.location.href);

        assert.strictEqual(
            ctrl.get('linkedinHref'),
            `https://www.linkedin.com/shareArticle?url=${location}&mini=true&title=test%20title&summary=test%20description&source=Open%20Science%20Framework`
        );
    });
});

test('emailHref computed property', function (assert) {
    this.inject.service('store');

    const store = this.store;
    const ctrl = this.subject();

    Ember.run(() => {
        const node = store.createRecord('node', {
            title: 'test title'
        });

        ctrl.setProperties({node});

        const location = encodeURIComponent(window.location.href);

        assert.strictEqual(
            ctrl.get('emailHref'),
            `mailto:?subject=test%20title&body=${location}`
        );
    });
});

test('hasTag computed property', function (assert) {
    this.inject.service('store');

    const store = this.store;
    const ctrl = this.subject();

    Ember.run(() => {
        const node = store.createRecord('node', {
            tags: []
        });

        ctrl.setProperties({node});

        assert.strictEqual(
            ctrl.get('hasTag'),
            false
        );
    });

    Ember.run(() => {
        const node = store.createRecord('node', {
            tags: ['a', 'b', 'c']
        });

        ctrl.setProperties({node});

        assert.strictEqual(
            ctrl.get('hasTag'),
            true
        );
    });
});

test('doiUrl computed property', function (assert) {
    this.inject.service('store');

    const store = this.store;
    const ctrl = this.subject();

    Ember.run(() => {
        const model = store.createRecord('preprint', {
            doi: '10.1037/rmh0000008'
        });

        ctrl.setProperties({model});

        assert.strictEqual(
            ctrl.get('doiUrl'),
            'https://dx.doi.org/10.1037/rmh0000008'
        );
    });
});

test('useShortenedDescription computed property', function (assert) {
    const ctrl = this.subject();

    const scenarios = [
        [false, true, true],
        [true, true, false],
        [false, false, false],
        [true, false, false]
    ];

    for (const [expandedAbstract, hasShortenedDescription, expected] of scenarios) {
        ctrl.setProperties({
            expandedAbstract,
            hasShortenedDescription
        });

        assert.strictEqual(ctrl.get('useShortenedDescription'), expected);
    }
});


