Astro.QueryBuilder = function() {
  this.selector = {};
  this.options = {};
  this.collection = null;
};

_.extend(Astro.QueryBuilder.prototype, {
  select: function(selector) {
    _.extend(this.selector, selector);
  },

  options: function(options) {
    _.extend(this.options, options);
  },

  find: function() {
    return this.collection.find(this.selector, this.options);
  },

  findOne: function() {
    return this.collection.findOne(this.selector, this.options);
  },

  remove: function() {
    return this.collection.remove(this.selector, this.options);
  }
});
