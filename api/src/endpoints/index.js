import express from 'express';
import neo4jRoutes from 'endpoints/neo4j';
import repoRoutes from 'endpoints/repository';
import dataOverlayRoutes from 'endpoints/dataOverlay';
import svgThumbRoutes from 'endpoints/svgThumbnail';
import swaggerRoutes from 'endpoints/swagger';

const router = express.Router();

router.use(neo4jRoutes);
router.use('/repository', repoRoutes);
router.use('/data-overlay', dataOverlayRoutes);
router.use('/svg-thumbnail', svgThumbRoutes);
router.use(swaggerRoutes);

export default router;
