import { Schema, model } from 'mongoose';
import ServiceKey from './service.key';

const Service = new Schema({
  name: String,
  route: String,
  proxy: { type: Boolean, default: false },
  api: String,
  timestamp: { type: Date, default: Date.now() },
});

Service.method('toJSON', function() {
  var obj = this.toObject();
  obj.id = obj._id;
  ;['_id', '__v'].map(key => {
    delete obj[key];
  });
  return obj;
});

Service.statics.create = async function(service) {
  const { name, route, proxy, api } = service;
  const newService = new this({
    name,
    route,
    proxy,
    api,
  });
  const { id } = await newService.save();
  return id;
}

Service.methods.newServiceKey = async function() {
  const newKey = await ServiceKey.create(this);
  return newKey;
}

Service.methods.getServiceKeys = async function() {
  const serviceKeys = await ServiceKey.find({ service: this.id });
  return serviceKeys;
}

export default model('Service', Service);
