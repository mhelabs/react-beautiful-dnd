// @flow
import getBestCrossAxisDroppable from './get-best-cross-axis-droppable';
import getClosestDraggable from './get-closest-draggable';
import moveToNewDroppable from './move-to-new-droppable/';
import noImpact from '../no-impact';
import getDraggablesInsideDroppable from '../get-draggables-inside-droppable';
import type { Result } from './move-cross-axis-types';
import type {
  DraggableId,
  DroppableId,
  Position,
  DroppableDimension,
  DraggableDimension,
  DraggableDimensionMap,
  DroppableDimensionMap,
  DraggableLocation,
  DragImpact,
  Viewport,
  Axis
} from '../../types';

import { makeOppositeAxis } from '../axis';

type Args = {|
  isMovingForward: boolean,
  // the current page center of the dragging item
  pageCenter: Position,
  // the dragging item
  draggableId: DraggableId,
  // the droppable the dragging item is in
  droppableId: DroppableId,
  // the original location of the draggable
  home: DraggableLocation,
  // all the dimensions in the system
  draggables: DraggableDimensionMap,
  droppables: DroppableDimensionMap,
  // any previous impact
  previousImpact: ?DragImpact,
  // the current viewport
  viewport: Viewport,
  oppositeAxis?: boolean,
|}

export default ({
  isMovingForward,
  pageCenter,
  draggableId,
  droppableId,
  home,
  draggables,
  droppables,
  previousImpact,
  viewport,
  oppositeAxis
}: Args): ?Result => {
  const draggable: DraggableDimension = draggables[draggableId];
  const source: DroppableDimension = droppables[droppableId];
  const axis: Axis = oppositeAxis ? makeOppositeAxis(source.axis) : source.axis;

  // not considering the container scroll changes as container scrolling cancels a keyboard drag

  const destination: ?DroppableDimension = getBestCrossAxisDroppable({
    isMovingForward,
    pageCenter,
    source,
    droppables,
    viewport,
    customAxis: axis,
  });

  // nothing available to move to
  if (!destination) {
    return null;
  }

  const insideDestination: DraggableDimension[] = getDraggablesInsideDroppable(
    destination, draggables
  );

  const target: ?DraggableDimension = getClosestDraggable({
    axis: axis,
    pageCenter,
    destination,
    insideDestination,
    viewport,
  });

  // Draggables available, but none are candidates for movement (eg none are visible)
  // Cannot move into the list
  if (insideDestination.length && !target) {
    return null;
  }

  return moveToNewDroppable({
    pageCenter,
    destination,
    draggable,
    target,
    insideDestination,
    home,
    previousImpact: previousImpact || noImpact,
    viewport,
  });
};
