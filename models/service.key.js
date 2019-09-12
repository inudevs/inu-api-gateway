import { Schema, model } from 'mongoose';

const ServiceKey = new Schema({
  service: String,
  latest: { type: Date, default: Date.now() },
  timestamp: { type: Date, default: Date.now() },
});

ServiceKey.statics.create = async function(service) {
  const newServiceKey = new this({
    service: service.id,
  });
  const { id } = await newServiceKey.save();
  return id;
}

export default model('ServiceKey', ServiceKey);
