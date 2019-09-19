import { Schema, model } from 'mongoose';

const Log = new Schema({
  path: String,
  method: String,
  status: Number,
  elapsed: Number,
  timestamp: { type: Number, default: Date.now },
});

Log.method('toJSON', function() {
  var obj = this.toObject();
  obj.id = obj._id;
  ;['_id', '__v'].map(key => {
    delete obj[key];
  });
  return obj;
});

Log.statics.create = async function(path, method, status, elapsed) {
  const log = new this({
    path,
    method,
    status,
    elapsed,
  });
  await log.save();
}

export default model('Log', Log);
