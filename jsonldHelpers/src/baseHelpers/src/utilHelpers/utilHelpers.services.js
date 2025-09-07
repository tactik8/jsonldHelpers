

export const services = {
    uuid: {
        new: generateUUIDv4,
        get: generateUUIDv4
    },
    url: {
        get: getCleanUrl,
        base: {
            get: getBaseUrl
        },
        domain: {
            get: getDomain
        }
    },
    email: {
        get: getCleanEmail
    },
    date: {
        lt: dateLessThan,
        gt: dateGreaterThan,
        min: dateMin,
        max: dateMax
    }
}



function generateUUIDv4() {
    // Use crypto.getRandomValues for better randomness if available,
    // otherwise fallback to Math.random (less secure but still functional).
    // This approach ensures compatibility with various environments.

    const randomBytes = new Uint8Array(16);

    let c1 = false;
    try {
        c1 = window.crypto && window.crypto.getRandomValues;
    } catch (error) {}

    if (c1 === true) {
        window.crypto.getRandomValues(randomBytes);
    } else {
        // Fallback for environments without window.crypto (e.g., older browsers)
        for (let i = 0; i < 16; i++) {
            randomBytes[i] = Math.floor(Math.random() * 256);
        }
    }

    // Set the four most significant bits of the 7th byte to 0100'B (version 4)
    randomBytes[6] = (randomBytes[6] & 0x0f) | 0x40;
    // Set the two most significant bits of the 9th byte to 10'B (variant 1, RFC 4122)
    randomBytes[8] = (randomBytes[8] & 0x3f) | 0x80;

    // Convert the byte array to a hexadecimal string representation of the UUID
    let uuid = "";
    for (let i = 0; i < 16; i++) {
        // Convert each byte to its two-digit hexadecimal representation
        const hex = randomBytes[i].toString(16).padStart(2, "0");
        uuid += hex;

        // Add hyphens at the standard UUID positions
        if (i === 3 || i === 5 || i === 7 || i === 9) {
            uuid += "-";
        }
    }

    return uuid;
}



function getCleanUrl(url){
    if(!url){
        return undefined
    }
    try {
        return String(new URL(url))
    } catch (error) {
        return undefined
    }
}

function getBaseUrl(url) {
    if(!url){
        return undefined
    }
  try {
      const url = new URL(window.location.href);
      const urlWithoutParams = url.origin + url.pathname;
      return urlWithoutParams;

  } catch (error) {
    return undefined
  }
}

function getDomain(url){
    if(!url){
        return undefined
    }
    try {
        const url = new URL(window.location.href);
        return url.hostname;
    } catch (error) {
        return undefined
    }
}

function getCleanEmail(email){
    if(!email){
        return undefined
    }
    try{
        let username = email.split('@')[0]
        let domain = email.split('@')[1]
        domain = domain.toLowerCase()
        return [username, domain].join('@')
    } catch (error){
        return undefined
    }
}



// -----------------------------------------------------
//  Comment 
// -----------------------------------------------------


function dateMin(dates){

    dates = Array.isArray(dates) ? dates : [dates]

    dates.sort((date1, date2) => {
        return lt(date1, date2);
    })
    return dates?.[0]
}


function dateMax(dates){

    dates = Array.isArray(dates) ? dates : [dates]

    dates.sort((date1, date2) => {
        return gt(date1, date2);
    })

    return dates?.[0]
}


function dateLessThan(date1, date2){

      // Attempt to convert inputs to Date objects.
      const d1 = new Date(date1);
      const d2 = new Date(date2);

      // Check if both converted dates are valid.
      if (isNaN(d1.getTime())) {
        return false
      }
      if (isNaN(d2.getTime())) {
        return false
      }

      // Compare the dates. The '<' operator works directly on Date objects.
      return d1 < d2;
    

    
}

function dateGreaterThan(date1, date2){

      // Attempt to convert inputs to Date objects.
      const d1 = new Date(date1);
      const d2 = new Date(date2);

      // Check if both converted dates are valid.
      if (isNaN(d1.getTime())) {
        return false
      }
      if (isNaN(d2.getTime())) {
        return true
      }

      // Compare the dates. The '<' operator works directly on Date objects.
      return d1 > d2;


}