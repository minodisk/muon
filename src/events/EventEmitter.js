//import muon.events.Event;
//import muon.events.EventPhase;

function EventEmitter() {
  this._events = {};
}

EventEmitter.prototype.on = function (type, listener, useCapture, priority) {
  if (typeof type !== "string") {
    throw new TypeError("EventEmitter#addEventListener: type isn't string");
  }
  if (typeof listener !== "function") {
    throw new TypeError("EventEmitter#addEventListener: listener isn't function");
  }
  if (useCapture == null) {
    useCapture = false;
  }
  if (priority == null) {
    priority = 0;
  }

  if (this._events[type] == null) {
    this._events[type] = [];
  }
  this._events[type].push({
    listener  : listener,
    useCapture: useCapture,
    priority  : priority
  });
  this._events[type].sort(this._sortOnPriorityInDescendingOrder);
  return this;
};

EventEmitter.prototype._sortOnPriorityInDescendingOrder = function (a, b) {
  return b.priority - a.priority;
};

EventEmitter.prototype.off = function (type, listener) {
  var i, storage;
  if (storage = this._events[type]) {
    i = storage.length;
    while (i--) {
      if (storage[i].listener === listener) {
        storage.splice(i, 1);
      }
    }
    if (storage.length === 0) {
      delete this._events[type];
    }
  }
  return this;
};

EventEmitter.prototype.emit = function (event) {
  var obj, objs, i, len;
  if (!(event instanceof Event)) {
    throw new TypeError("EventEmitter#dispatchEvent: event isn't Event");
  }

  event.currentTarget = this;
  if ((objs = this._events[event.type]) != null) {
    for (i = 0, len = objs.length; i < len; i++) {
      obj = objs[i];
      if (obj.useCapture && event.eventPhase === EventPhase.CAPTURING_PHASE || obj.useCapture === false && event.eventPhase !== EventPhase.CAPTURING_PHASE) {
        (function (obj, event) {
          return setTimeout(function () {
            return obj.listener(event);
          }, 0);
        })(obj, event);
        if (event._isPropagationStoppedImmediately) {
          break;
        }
      }
    }
  }
  return !event._isDefaultPrevented;
};

this.EventEmitter = EventEmitter;
