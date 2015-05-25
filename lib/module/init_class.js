var checks = {};

var methods = {};

methods.createQueryBuilder = function() {
  var queryBuilder = new Astro.QueryBuilder();
  var eventData = new Astro.EventData(queryBuilder);

  Astro.eventManager.emit('createQueryBuilder', eventData, this);

  return queryBuilder;
};

onInitClass = function(schemaDefinition) {
  var Class = this;

  _.extend(Class, methods);
};
