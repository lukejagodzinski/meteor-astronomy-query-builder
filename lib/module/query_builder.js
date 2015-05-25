Astro.QueryBuilder = function() {
  this.selector = {};
  this.options = {};
};

_.extend(Astro.QueryBuilder.prototype, {
  select: function(selector) {
    _.extend(this.selector, selector);
  }
});
