const mongoose = require("mongoose");

const AeshSchema = mongoose.Schema(
  {
    Prénom: { type: String, required: true },
    Contrat: { type: Number, required: true },
    Planning: {
      lundi: {
        Matin1: { type: mongoose.Schema.Types.ObjectId, ref: 'Enfant'  },
        Matin2: { type: mongoose.Schema.Types.ObjectId, ref: 'Enfant'  },
        Amidi1: { type: mongoose.Schema.Types.ObjectId, ref: 'Enfant'  },
        Amidi2: { type: mongoose.Schema.Types.ObjectId, ref: 'Enfant'  },
      },
      mardi: {
        Matin1: { type: mongoose.Schema.Types.ObjectId, ref: 'Enfant'  },
        Matin2: { type: mongoose.Schema.Types.ObjectId, ref: 'Enfant'  },
        Amidi1: { type: mongoose.Schema.Types.ObjectId, ref: 'Enfant'  },
        Amidi2: { type: mongoose.Schema.Types.ObjectId, ref: 'Enfant'  },
      },
      jeudi: {
        Matin1: { type: mongoose.Schema.Types.ObjectId, ref: 'Enfant'  },
        Matin2: { type: mongoose.Schema.Types.ObjectId, ref: 'Enfant'  },
        Amidi1: { type: mongoose.Schema.Types.ObjectId, ref: 'Enfant'  },
        Amidi2: { type: mongoose.Schema.Types.ObjectId, ref: 'Enfant'  },
      },
      vendredi: {
        Matin1: { type: mongoose.Schema.Types.ObjectId, ref: 'Enfant'  },
        Matin2: { type: mongoose.Schema.Types.ObjectId, ref: 'Enfant'  },
        Amidi1: { type: mongoose.Schema.Types.ObjectId, ref: 'Enfant'  },
        Amidi2: { type: mongoose.Schema.Types.ObjectId, ref: 'Enfant'  },
      },
    },
  },
  {
    collection: "aeshs",
  }
);

const Aesh = mongoose.model("Aesh", AeshSchema);

module.exports = Aesh;
