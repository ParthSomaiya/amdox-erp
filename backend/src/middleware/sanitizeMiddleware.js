export const sanitizeInput =
  (req, res, next) => {

    const clean = (obj) => {

      for (const key in obj) {

        if (
          key.includes("$") ||
          key.includes(".")
        ) {

          delete obj[key];

        }

        if (
          typeof obj[key] === "object"
        ) {

          clean(obj[key]);

        }

      }

    };

    clean(req.body);
    clean(req.query);
    clean(req.params);

    next();

};