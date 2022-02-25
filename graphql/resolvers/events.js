const BullNBearDetail = require('../../models/bullNBearDetail');
const BullNBear = require('../../models/bullNBear');

module.exports = {
  events: async (arg) => {
    try {
      //console.log(arg)
      let { productType, referenceInstrument } = arg;
      let factorMin = parseInt(arg.factorMin);
      let factorMax = parseInt(arg.factorMax);
      let limit = parseInt(arg.limit);
      let skip = parseInt(arg.skip);
      let bullNBearData = [];
      let bullNBearDataCount 
      if (referenceInstrument === "undefined") {
        console.log("enter")
        bullNBearDataCount = await BullNBear.find({ factor: { $lt: factorMax, $gt: factorMin } }).count();

        bullNBearData = await BullNBear.aggregate([
          { "$match": { factor: { $lt: factorMax, $gt: factorMin } } },
          {
            "$lookup": {
              "from": "bull_n_bear_details_examples",
              "localField": "isin",
              "foreignField": "isin",
              "as": "place"
            },

          },
          {
            $unwind:
            {
              path: "$place",
              preserveNullAndEmptyArrays: true
            }
          },
          {
            $project: {
              "_id": 1,
              "reference_instrument": 1,
              "symbol": 1,
              "type": 1,
              "factor": 1,
              "bid": 1,
              "ask": 1,
              "product_type": { $ifNull: ["$place.product_type", null] },
              "investment_class": { $ifNull: ["$place.investment_class", null] },
              "barrier": { $ifNull: ["$place.barrier", null] },
            }
          }
        ]).skip(skip).limit(limit)
      } else {
        console.log("second")
        bullNBearDataCount = await BullNBear.find({ factor: { $lt: factorMax, $gt: factorMin }, reference_instrument: referenceInstrument }).count();

        bullNBearData = await BullNBear.aggregate([
          { "$match": { factor: { $lt: factorMax, $gt: factorMin }, reference_instrument: referenceInstrument } },
          {
            "$lookup": {
              "from": "bull_n_bear_details_examples",
              "localField": "isin",
              "foreignField": "isin",
              "as": "place"
            },

          },
          {
            $unwind:
            {
              path: "$place",
              preserveNullAndEmptyArrays: true
            }
          },
          {
            $project: {
              "_id": 1,
              "reference_instrument": 1,
              "symbol": 1,
              "type": 1,
              "factor": 1,
              "bid": 1,
              "ask": 1,
              "product_type": { $ifNull: ["$place.product_type", null] },
              "investment_class": { $ifNull: ["$place.investment_class", null] },
              "barrier": { $ifNull: ["$place.barrier", null] },
            }
          }
        ]).skip(skip).limit(limit)
      }


      if (bullNBearData.length > 0) {
        bullNBearData[0].count = bullNBearDataCount;
      }

      return bullNBearData

    } catch (err) {
      throw err;
    }
  },

  invest: async () => {
    try {
      console.log("investment_class");
      let investment_classTemp = []
      const investment_class = await BullNBear.distinct("reference_instrument");

      investment_class.map(event => {
        investment_classTemp.push({ investment_class: event, label: event })
      });

      return investment_classTemp

    } catch (err) {
      throw err;
    }
  }
};
