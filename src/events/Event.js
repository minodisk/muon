function Event(type, bubbles, cancelable) {
  var event;

  if (bubbles == null) {
    bubbles = false;
  }
  if (cancelable == null) {
    cancelable = false;
  }
  if (!(this instanceof Event)) {
    return new Event(type, bubbles, cancelable);
  }

  if (type instanceof Event) {
    event = type;
    type = event.type;
    bubbles = event.bubbles;
    cancelable = event.cancelable;
    this.currentTarget = event.currentTarget;
    this.target = event.target;
  }
  this.type = type;
  this.bubbles = bubbles;
  this.cancelable = cancelable;
  this._isPropagationStopped = false;
  this._isPropagationStoppedImmediately = false;
  this._isDefaultPrevented = false;
}

Event.prototype.formatToString = function () {
};

Event.prototype.stopPropagation = function () {
  this._isPropagationStopped = true;
};

Event.prototype.stopImmediatePropagation = function () {
  this._isPropagationStopped = true;
  this._isPropagationStoppedImmediately = true;
};

Event.prototype.isDefaultPrevented = function () {
  return this._isDefaultPrevented;
};

Event.prototype.preventDefault = function () {
  this._isDefaultPrevented = true;
};

this.Event = Event;
