const flightRoutesService = require('../services/flightRoutesService');
const Joi = require('joi');

const querySchema = Joi.object({
  origin: Joi.string().required(),
  destination: Joi.string().required(),
  departureDate: Joi.string().isoDate().required(),
  adults: Joi.number().integer().min(1).required()
});

exports.getFlightRoutes = async (req, res, next) => {
  const { error } = querySchema.validate(req.query);
  if (error) return res.status(400).json({ error: error.details[0].message });

  try {
    const routes = await flightRoutesService.getFlightRoutesOnly(req.query);
    res.json({
      origin: req.query.origin,
      destination: req.query.destination,
      departureDate: req.query.departureDate,
      routes
    });
  } catch (err) {
    next(err);
  }
};

exports.getFlightRoutesWithHotels = async (req, res, next) => {
  const { error } = querySchema.validate(req.query);
  if (error) return res.status(400).json({ error: error.details[0].message });

  try {
    const { routes, hotels } = await flightRoutesService.getFlightRoutesWithHotels(req.query);
    res.json({
      origin: req.query.origin,
      destination: req.query.destination,
      departureDate: req.query.departureDate,
      routes,
      hotels
    });
  } catch (err) {
    next(err);
  }
};
