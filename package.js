Package.describe({
  summary: 'Query Builder for Meteor Astronomy',
  version: '0.1.0',
  name: 'jagi:astronomy-query-builder',
  git: 'https://github.com/jagi/meteor-astronomy-query-builder.git'
});

Package.onUse(function(api) {
  api.versionsFrom('1.1.0.2');

  api.use('jagi:astronomy@0.9.0');
  api.use('underscore');

  api.imply('jagi:astronomy');

  // Module.
  api.addFiles('lib/module/query_builder.js', ['client', 'server']);
  api.addFiles('lib/module/init_class.js', ['client', 'server']);
  api.addFiles('lib/module/init_instance.js', ['client', 'server']);
  api.addFiles('lib/module/module.js', ['client', 'server']);
});
