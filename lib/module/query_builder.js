Astro.QueryBuilder = function() {};

Astro.QueryBuilder.debug = false;

var composeOptions = function(operation) {
  var options = {};

  if (operation === 'find' || operation === 'findOne') {
    if (!_.isNull(this._sort)) {
      options.sort = this._sort;
    }

    if (!_.isNull(this._skip)) {
      options.skip = this._skip;
    }

    if (!_.isNull(this._fields)) {
      options.fields = this._fields;
    }
  }

  if (operation === 'find') {
    if (!_.isNull(this._limit)) {
      options.limit = this._limit;
    }
  }

  if (operation === 'update' || operation === 'upsert') {
    if (!_.isNull(this._multi)) {
      options.multi = this._multi;
    }
  }

  return options;
};

_.extend(Astro.QueryBuilder.prototype, {
  _collection: null,
  _selector: null,
  _modifier: null,
  _sort: null,
  _skip: null,
  _limit: null,
  _fields: null,
  _multi: null,

  from: function(collection) {
    if (!(collection instanceof Mongo.Collection)) {
      return;
    }

    this._collection = collection;

    return this;
  },

  modify: function(modifier, field, value) {
    this._modifier = this._modifier || {};
    this._modifier[modifier] = this._modifier[modifier] || {};
    this._modifier[modifier][field] = value;

    return this;
  },

  set: function() {
    var self = this;

    if (arguments.length === 2) {
      this.modify('$set', arguments[0], arguments[1]);
    } else if (arguments.length === 1 && _.isObject(arguments[0])) {
      _.each(arguments[0], function(value, field) {
        self.set(field, value);
      });
    }

    return this;
  },

  setOnInsert: function() {
    var self = this;

    if (arguments.length === 2) {
      this.modify('$setOnInsert', arguments[0], arguments[1]);
    } else if (arguments.length === 1 && _.isObject(arguments[0])) {
      _.each(arguments[0], function(value, field) {
        self.setOnInsert(field, value);
      });
    }

    return this;
  },

  unset: function(fields) {
    if (arguments.lengh > 1) {
      return this.unset(Array.prototype.slice.call(arguments, 0));
    } else if (_.isString(fields)) {
      fields = [fields];
    }

    this._modifier = this._modifier || {};
    this._modifier.$unset = this._modifier.$unset || {};
    this._modifier.$unset[arguments[0]] = arguments[1];

    return this;
  },

  inc: function(field, amount) {
    return this.modify('$inc', field, amount);
  },

  mul: function(field, number) {
    return this.modify('$mul', field, number);
  },

  rename: function(oldName, newName) {
    return this.modify('$rename', oldName, newName);
  },

  min: function(field, min) {
    return this.modify('$min', field, min);
  },

  max: function(field, max) {
    return this.modify('$max', field, max);
  },

  currentDate: function(field, type) {
    return this.modify('$currentDate', field, type);
  },

  selector: function(selector) {
    this._selector = this._selector || {};

    _.extend(this._selector, selector);

    return this;
  },

  sort: function() {
    var self = this;

    if (arguments.length === 2) {
      this._sort = this._sort || {};
      this._sort[arguments[0]] = arguments[1];
    } else if (arguments.length === 1 && _.isObject(arguments[0])) {
      _.each(arguments[0], function(value, field) {
        self.sort(field, value);
      });
    }

    return this;
  },

  skip: function(skip) {
    this._skip = skip;

    return this;
  },

  limit: function(limit) {
    this._limit = limit;

    return this;
  },

  fields: function(fields) {
    this._fields = this._fields || {};

    var self = this;

    if (_.isArray(fields)) {
      _.each(fields, function(field) {
        self._fields[field] = 1;
      });
    } else if (_.isObject(fields)) {
      _.each(fields, function(flag, field) {
        self._fields[field] = !!flag;
      });
    }

    return this;
  },

  find: function() {
    if (!this._collection) {
      return;
    }

    this._selector = this._selector || {};

    var selector = this._selector;
    var options = composeOptions.call(this, 'find');

    if (Astro.QueryBuilder.debug) {
      console.log('selector', selector);
      console.log('options', options);
    }

    return this._collection.find(selector, options);
  },

  findOne: function() {
    if (!this._collection) {
      return;
    }

    this._selector = this._selector || {};

    var selector = this._selector;
    var options = composeOptions.call(this, 'findOne');

    if (Astro.QueryBuilder.debug) {
      console.log('selector', selector);
      console.log('options', options);
    }

    return this._collection.findOne(selector, options);
  },

  insert: function(callback) {
    if (!this._collection || !this._modifier || !this._modifier.$set) {
      return;
    }

    var data = this._modifier.$set;

    if (Astro.QueryBuilder.debug) {
      console.log('data', data);
    }

    return this._collection.insert(data, callback);
  },

  update: function(callback) {
    if (!this._collection || !this._modifier) {
      return;
    }

    this._selector = this._selector || {};

    var selector = this._selector;
    var modifier = this._modifier;
    var options = composeOptions.call(this, 'update');

    if (Astro.QueryBuilder.debug) {
      console.log('selector', selector);
      console.log('modifier', modifier);
      console.log('options', options);
    }

    return this._collection.update(selector, modifier, options, callback);
  },

  upsert: function(callback) {
    if (!this._collection || !this._modifier) {
      return;
    }

    this._selector = this._selector || {};

    var selector = this._selector;
    var modifier = this._modifier;
    var options = composeOptions.call(this, 'upsert');

    if (Astro.QueryBuilder.debug) {
      console.log('selector', selector);
      console.log('modifier', modifier);
      console.log('options', options);
    }

    return this._collection.upsert(selector, modifier, options, callback);
  },

  remove: function(callback) {
    if (!this._collection) {
      return;
    }

    this._selector = this._selector || {};

    var selector = this._selector;

    if (Astro.QueryBuilder.debug) {
      console.log('selector', selector);
    }

    return this._collection.remove(this._selector, callback);
  }
});

// Aliases.
_.extend(Astro.QueryBuilder.prototype, {
  offset: Astro.QueryBuilder.prototype.skip,
  filter: Astro.QueryBuilder.prototype.fields,
  select: Astro.QueryBuilder.prototype.fields,
  get: Astro.QueryBuilder.prototype.fields
});
