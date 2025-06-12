const multer = require("multer");
const { ApiError } = require("../utils/ApiError");
const { MULTIPLE_FILE_SIZE_LIMIT,SINGLE_FILE_SIZE_LIMIT } = require("../config/env.config"); 


const storage = multer.memoryStorage();
// upload multiple file 
const uploadMultiple  = multer({
    storage: storage,
    limits: { fileSize: MULTIPLE_FILE_SIZE_LIMIT * 1024 * 1024 }, 
});

// upload single file
const uploadSingle  = multer({
    storage: storage,
    limits: { fileSize: SINGLE_FILE_SIZE_LIMIT * 1024 * 1024 }, 
});
 
// Error handler for Multer-specific errors
const handleMulterErrors = (item) => {
    return (err, req, res, next) => {
        if (err.code === "LIMIT_FILE_SIZE") {
            return ApiError(res, 400, `File too large. Max file size is ${item.maxSize} MB.`);
        }
        if (err.code === "LIMIT_FILE_COUNT") {
            return ApiError(res, 400, `Too many files uploaded. Maximum allowed is 5 files.`);
        }
        next(err);
    };
}

const MultipleFileHandleMulterErrors = (maxSizes) => {
    return (req, res, next) => {
        const files = req.files;

        if (!files) return next();

        for (const field in files) {
            if (!Array.isArray(files[field])) continue;

            let totalFieldSize = 0;

            if (field === 'license_image') {
                totalFieldSize = files[field].reduce((total, file) => total + file.size, 0);

                if (totalFieldSize > maxSizes[field] * 1024 * 1024) {
                    return next({
                        status: false,
                        statusCode: 400,
                        message: `License image size too large. Max total size is ${maxSizes[field]} MB.`
                    });
                }

                for (const file of files[field]) {
                    if (file.size >= 2 * 1024 * 1024) {
                        return next({
                            status: false,
                            statusCode: 400,
                            message: `Each License image should be max 2 MB.`
                        });
                    }
                }
            }

            // ✅ Corrected Size Limits for `resume` (2 MB) and `file` (1 MB)
            for (const file of files[field]) {
                const fieldMaxSize = 
                    field === 'resume' ? 2 * 1024 * 1024 : // Resume limit: 2 MB
                    field === 'file' ? 1 * 1024 * 1024 :    // File limit: 1 MB
                    (maxSizes[field] || 1) * 1024 * 1024;   // Default limit

                const exceededSize = ((file.size - fieldMaxSize) / (1024 * 1024)).toFixed(2);

                if (file.size > fieldMaxSize) {
                    const fieldName =
                        field === 'resume'
                            ? 'Resume'
                            : field === 'file'
                            ? 'Image'
                            : 'Unknown File';

                    return next({
                        status: false,
                        statusCode: 400,
                        message: `${fieldName} size too large. Max file size is ${fieldMaxSize / (1024 * 1024)} MB.`
                    });
                }
            }
        }

        // ✅ Only proceed if all checks pass
        next();
    };
};





  

module.exports = {
    uploadMultiple,
    uploadSingle,
    handleMulterErrors,
    MultipleFileHandleMulterErrors
};
