'use strict'

const mongoose = require('mongoose');

const connectString = 'mongodb://mongoadmin:Password1!@localhost:27018/ecommerce?authSource=admin';

// Schema & Model test
const TestSchema = new mongoose.Schema({ name: String });
const Test = mongoose.model('Test', TestSchema);

describe('MongoDB Connection', () => {

  // Kết nối trước tất cả test
  beforeAll(async () => {
    await mongoose.connect(connectString, { useNewUrlParser: true, useUnifiedTopology: true });
  });

  // Cleanup dữ liệu và đóng kết nối sau tất cả test
  afterAll(async () => {
    await Test.deleteMany({});
    await mongoose.connection.close();
  });

  it('should connect to mongoose', () => {
    expect(mongoose.connection.readyState).toBe(1); // 1 = connected
  });

  it('should create a test document', async () => {
    const testDoc = await Test.create({ name: 'test' });
    expect(testDoc.isNew).toBe(false); 
    expect(testDoc.name).toBe('test');
  });

  it('should find a test document', async () => {
    const testDoc = await Test.findOne({ name: 'test' });
    expect(testDoc).not.toBeNull();
    expect(testDoc.name).toBe('test');
  });
});
