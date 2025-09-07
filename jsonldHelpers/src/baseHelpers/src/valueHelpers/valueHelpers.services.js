
export const services = {
    
    clean: analyzeAndConvert,
    url: {
        isValid: isUrl,
        toUrl: toUrl,
    },
    email: {
        isValid: isEmail,
        toEmail: toEmail,
    },
};

// -----------------------------------------------------
//  Comment
// -----------------------------------------------------

function analyzeAndConvert(value) {
    /**
     * Analyzes and converts a value to its most likely type.
     * @param {*} value - The value to analyze and convert.
     * @returns {Object} - An object containing the original value, the cleaned value, the inferred type, a boolean indicating if conversion was performed, and notes.
     * @example analyzeAndConvert('  123  ') // { original: '  123  ', cleaned: 123, type: 'number', converted: true, notes: 'Successfully converted to a floating-point number
     *
     */
    const result = {
        original: value,
        cleaned: value,
        type: "unknown",
        converted: false,
        notes: "Input did not match a specific type.",
    };

    // 1. Handle null or undefined inputs directly.
    if (value === null || typeof value === "undefined") {
        result.type = String(value);
        result.notes = "Input is null or undefined.";
        return result;
    }

    // For non-string inputs that are not numbers, classify them by their constructor.
    if (typeof value !== "string" && typeof value !== "number") {
        result.type = value.constructor.name;
        result.notes = "Input is a non-string, non-numeric object.";
        return result;
    }

    // 2. If it's a string, trim whitespace. This is the most common cleaning step.
    if (typeof value === "string") {
        result.cleaned = value.trim();
    }

    const cleanedValue = result.cleaned;

    // --- Type Checking ---
    // The order of these checks is important to avoid ambiguity (e.g., a numeric
    // string could be misinterpreted as a date timestamp).

    // 3. Check for Number (or a string that is a number)
    // It must not be an empty string and must be a finite number.
    if (cleanedValue !== "" && isFinite(Number(cleanedValue))) {
        result.type = "number";
        result.cleaned = parseFloat(cleanedValue);
        result.converted = true;
        result.notes = "Successfully converted to a floating-point number.";
        return result;
    }

    // 4. Check for Date
    // We ensure it's not just a number (which new Date() can interpret as a timestamp)
    // by checking that the original string contained non-numeric characters (/, -, or space).
    const isPotentiallyDateString = /[/\s-]/.test(cleanedValue);
    if (isPotentiallyDateString) {
        const date = new Date(cleanedValue);
        // Check if the created date is valid. `getTime()` on an invalid date returns NaN.
        if (!isNaN(date.getTime())) {
            result.type = "date";
            result.cleaned = date; // Store the actual Date object
            result.converted = true;
            result.notes = `Successfully parsed as a Date object. ISO format: ${date.toISOString()}`;
            return result;
        }
    }

    // 5. Check for Email using a Regular Expression
    // This regex checks for a basic structure: chars@chars.chars
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(cleanedValue)) {
        result.type = "email";
        result.notes = "Value matches the structure of an email address.";
        // No conversion needed, just identification and cleaning.
        result.converted = value !== result.cleaned;
        return result;
    }

    // 6. Check for URL using a Regular Expression
    // This regex looks for an optional protocol, a domain, and a TLD.
    // It's a simplified regex for common web URLs.
    const urlRegex =
        /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
    if (urlRegex.test(cleanedValue)) {
        result.type = "url";
        result.notes = "Value matches the structure of a URL.";
        result.converted = value !== result.cleaned;
        return result;
    }

    // 7. Check for Boolean
    // This checks for common boolean string representations.
    const booleanStrings = ["true", "false", "yes", "no"];
    if (booleanStrings.includes(cleanedValue.toLowerCase())) {
        result.type = "boolean";
        result.cleaned =
            cleanedValue.toLowerCase() === "true" ||
            cleanedValue.toLowerCase() === "yes";
        result.converted = true;
        result.notes = "Successfully converted to a boolean value.";
    }

    // 8. Check for JSON
    // This attempts to parse the string as JSON.
    if (
        cleanedValue.startsWith("{") ||
        cleanedValue.startsWith("[") ||
        cleanedValue.startsWith('"')
    ) {
        let jsonValue = cleanedValue;

        // Remove any leading/trailing whitespace and newlines.
        jsonValue = jsonValue.trim();
        // Remove any trailing commas from JSON objects or arrays.
        jsonValue = jsonValue.replace(/,\s*([\]}])/g, "$1");
        // Remove any comments from JSON.
        jsonValue = jsonValue.replace(/\/\/.*|\/\*[\s\S]*?\*\//g, "");

        try {
            let value = JSON.parse(jsonValue);
            result.type = "json";
            result.cleaned = value;
            result.converted = true;
            result.notes = "Successfully parsed as JSON.";
        } catch (e) {
            // If parsing fails, it's not JSON.
        }
    }

    // 9. If no other types match, it's just a generic string.
    if (typeof cleanedValue === "string") {
        result.type = "string";
        result.notes = "The value is a generic string.";
        result.converted = value !== result.cleaned;
    }

    return result;
}

// -----------------------------------------------------
//  Comment
// -----------------------------------------------------

function isUrl(value) {
    /**
     * Checks if a value is a URL
     * @param {*} value - The value to check
     * @returns {Boolean} - True if the value is a URL, false otherwise
     * @example isUrl('https://www.google.com') // true
     */

    let result;
    let isValid;

    // Input validation
    let c1 = value !== undefined;
    let c2 = typeof value === "string";

    isValid = c1 && c2;
    if (isValid === false) {
        return false;
    }

    // Input test
    const urlRegex =
        /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
    result = urlRegex.test(value);

    // return
    return result;
}

function toUrl(inputValue, defaultValue) {
    /**
     * Converts a value to a URL
     * @param {*} value - The value to convert
     * @returns {String} - The URL
     * @example toUrl('https://www.google.com') // 'https://www.google.com'
     */

    //

    let result;
    let value = inputValue;
    let isValid = true;
    let errorMessage = "Invalid Url: ";

    // Input validation
    let c1 = value !== undefined;
    let c2 = typeof value === "string";

    isValid = c1 && c2;

    // Process input
    if (isValid === true) {
        try {
            value = value.trim();
            result = String(new URL(value));
        } catch (err) {
            isValid = false;
        }
    }

    // Final validity check
    isValid = isUrl(result);

    // Return result
    if (isValid === false) {
        if (!defaultValue) {
            throw errorMessage + String(value);
        }
        return defaultValue;
    }

    return result;
}

function isEmail(value) {
    /**
     * Checks if a value is an email
     * @param {*} value - The value to check
     * @returns {Boolean} - True if the value is an email, false otherwise
     *
     */

    //
    let result;
    let isValid;

    // Input validation
    let c1 = value !== undefined;
    let c2 = typeof value === "string";

    isValid = c1 && c2;
    if (isValid === false) {
        return false;
    }

    // Input test
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    result = emailRegex.test(value);

    // Return
    return result;
}

function toEmail(inputValue, defaultValue) {
    /**
     * Converts a value to an email
     * @param {*} value - The value to convert
     * @returns {String} - The email
     * @example toEmail('john.doe@gmail.com') // 'john.doe@gmail.com'
     */

    let result;
    let value = inputValue;
    let isValid = true;
    let errorMessage = "Invalid Email: ";

    // Input validation
    let c1 = value !== undefined;
    let c2 = typeof value === "string";

    isValid = c1 && c2;

    // Process input
    if (isValid === true) {
        try {
            value = value.trim();
            let username = value.split("@")[0];
            let domain = value.split("@")[1];
            domain = domain.toLowerCase();
            result = [username, value].join("@");
        } catch (err) {
            isValid = false;
        }
    }

    // Final validity check
    isValid = isEmail(result);

    // Return result
    if (isValid === false) {
        if (!defaultValue) {
            throw errorMessage + String(value);
        }
        return defaultValue;
    }

    return result;
}
