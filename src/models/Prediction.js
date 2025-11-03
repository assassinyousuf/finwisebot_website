const mongoose = require('mongoose');
const { Schema } = mongoose;

const PredictionSchema = new Schema({
  input: { type: Schema.Types.Mixed },
  output: { type: Schema.Types.Mixed },
  meta: { type: Schema.Types.Mixed },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.models.Prediction || mongoose.model('Prediction', PredictionSchema);
