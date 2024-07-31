import mongoose from "mongoose";
const contactInfo_schema = new mongoose.Schema(
  {
    employeeId: {
      type: Number,
      required: true,
      unique: true,
    },
    phoneNo1: {
      type: String,
      // required: true,
      // unique:true,
      match: [/^(\+\d{1,3}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/, "Invalid phone number format"]
    },
    phoneNo2: {
      type: String,
      // unique:true,
      // required:false,
      match: [/^(\+\d{1,3}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/, "Invalid phone number format"],
      set: function(value) {
        return value === "" ? undefined : value;
      }
    },
    temp_House_NO: {
      type: String,
      // required: true,
    },
    temp_street_Name: {
      type: String,
      // required: true,
      trim: true,
    },
    temp_city_Name: {
      type: String,
      // required: true,
      trim: true,
      match: /^[a-zA-Z\s]+$/,
    },
    temp_State: {
      type: String,
      // required: true,
      match: /^[a-zA-Z\s]+$/,
    },
    temp_country: {
      type: String,
      // required: true,
      match: /^[a-zA-Z\s]+$/,
    },
    temp_Pincode: {
      type: Number,
      // required: true,
    },
    perm_House_No: {
      type: String,
      // required: true,
    },
    perm_street_Name: {
      type: String,
      // required: true,
      trim: true,
    },
    perm_City_Name: {
      type: String,
      // required: true,
      trim: true,
      match: /^[a-zA-Z\s]+$/,
    },
    perm_State: {
      type: String,
      // required: true,
      match: /^[a-zA-Z\s]+$/,
    },
    perm_Country: {
      type: String,
      // required: true,
      match: /^[a-zA-Z\s]+$/,
    },
    perm_pin_code: {
      type: Number,
      // required: true,
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active'
    }
  },
  { timestamps: true }

  
);
contactInfo_schema.pre('save', function(next) {
  if (this.phoneNo1 && this.phoneNo1 && this.phoneNo1 === this.phoneNo2) {
    next(new Error('ContactNumber1 and ContactNumber2 cannot be the same.'));
  } else {
    next();
  }
});
export const contactdata = mongoose.model("ContactInfo", contactInfo_schema);


