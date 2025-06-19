/* eslint-disable object-curly-newline */
/* eslint-disable import/prefer-default-export */
import { Request, Response } from 'express';
import { planets } from '../../constants/planets';


export const catalog = async (req: Request, res: Response): Promise<void> => {
  try {
    const astros = planets.concat([])
    // const {astro} = req.body
    // const coordinates = await getCoordinates(astro)
    res.json({ astros});  // No return aquí
  } catch (error) {
    console.error('hubo un error!');
    res.status(500).json({ message: 'Ocurrió un error' }); // Tampoco return aquí
  }
};