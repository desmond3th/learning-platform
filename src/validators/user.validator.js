import { body } from "express-validator";

const userRegisterValidator = () => {
    return [
        body("email")
            .trim()
            .notEmpty()
            .withMessage("Email is required")
            .isEmail()
            .withMessage("Email is invalid"),
        body("username")
            .trim()
            .notEmpty()
            .withMessage("Username is required")
            .isLowercase()
            .withMessage("Username must be lowercase")
            .isLength({ min: 3 })
            .withMessage("Username must be at lease 3 characters long"),
        body("fullname")
            .trim()
            .notEmpty()
            .withMessage("Fullname is required")
            .isLowercase()
            .withMessage("Fullname must be lowercase"),
        body("password")
            .trim()
            .notEmpty()
            .withMessage("Password is required"),
    ];
}

const userLoginValidator = () => {
    return [
        body("email").optional().isEmail().withMessage("Email is invalid"),
        body("username").optional(),
        body("password").notEmpty().withMessage("Password is required"),
    ];
};

const ChangeCurrentPasswordValidator = () => {
    return [
        body("oldPassword").notEmpty().withMessage("Old password is required"),
        body("newPassword").notEmpty().withMessage("New password is required"),
    ];
};


export { userRegisterValidator,
        userLoginValidator, 
        ChangeCurrentPasswordValidator }