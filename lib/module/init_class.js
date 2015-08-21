var checks = {};

var methods = {};

methods.createQueryBuilder = function() {
  var Class = this;

  // Create query builder and set collection.
  var queryBuilder = new Astro.QueryBuilder();
  queryBuilder.from(Class.getCollection());

  // Populate query builder object with data comming from events.
  var event = new Astro.Event('createquerybuilder', queryBuilder);
  event.target = Class;
  Class.schema.emit(event);

  return queryBuilder;
};

Astro.eventManager.on('initClass', function(schemaDefinition) {
  var Class = this;

  _.extend(Class, methods);
});
