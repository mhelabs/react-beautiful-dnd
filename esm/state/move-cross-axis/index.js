
import getBestCrossAxisDroppable from './get-best-cross-axis-droppable';
import getClosestDraggable from './get-closest-draggable';
import moveToNewDroppable from './move-to-new-droppable/';
import noImpact from '../no-impact';
import getDraggablesInsideDroppable from '../get-draggables-inside-droppable';


import { makeOppositeAxis } from '../axis';

export default (function (_ref) {
  var isMovingForward = _ref.isMovingForward,
      pageCenter = _ref.pageCenter,
      draggableId = _ref.draggableId,
      droppableId = _ref.droppableId,
      home = _ref.home,
      draggables = _ref.draggables,
      droppables = _ref.droppables,
      previousImpact = _ref.previousImpact,
      viewport = _ref.viewport,
      oppositeAxis = _ref.oppositeAxis;

  var draggable = draggables[draggableId];
  var source = droppables[droppableId];
  var axis = oppositeAxis ? makeOppositeAxis(source.axis) : source.axis;

  var destination = getBestCrossAxisDroppable({
    isMovingForward: isMovingForward,
    pageCenter: pageCenter,
    source: source,
    droppables: droppables,
    viewport: viewport,
    customAxis: axis
  });

  if (!destination) {
    return null;
  }

  var insideDestination = getDraggablesInsideDroppable(destination, draggables);

  var target = getClosestDraggable({
    axis: axis,
    pageCenter: pageCenter,
    destination: destination,
    insideDestination: insideDestination,
    viewport: viewport
  });

  if (insideDestination.length && !target) {
    return null;
  }

  return moveToNewDroppable({
    pageCenter: pageCenter,
    destination: destination,
    draggable: draggable,
    target: target,
    insideDestination: insideDestination,
    home: home,
    previousImpact: previousImpact || noImpact,
    viewport: viewport
  });
});