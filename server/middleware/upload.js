import multer from "multer";
const storage = multer.memoryStorage();

export const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB file size limit
  },
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype.startsWith('image/') ||
      file.mimetype === 'application/pdf'
    ) {
      cb(null, true);
    } else {
      cb(new Error('File type not supported'), false);
    }
  },
});

//module.exports = {upload};

export const uploadFile = multer({

  storage: storage,
  // limits: { fileSize: 1024 * 1024 * 10 } 
});



//Exit Information
export const multipleUploadFiles = multer({
  storage: storage,
}).array('UploadDocumentation', 10);


// Personal Information
  export const multiUpload = upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'idProof1', maxCount: 1 },
    { name: 'idProof2', maxCount: 1 }
  ]);

// Experience

export const multiDocUpload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype === 'application/pdf' ||
      file.mimetype === 'application/msword' ||
      file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ) {
      cb(null, true);
    } else {
      cb(new Error('File type not supported. Only PDF and Word documents are allowed.'), false);
    }
  },
}).fields([
  { name: 'experienceLetter', maxCount: 1 },
  { name: 'offerLetter', maxCount: 1 },
  { name: 'relievingLetter', maxCount: 1 },
]);


//Plans and Goals
export const PlansandGoalsFiles = upload.fields([{ name: 'Plan', maxCount: 1 }]);