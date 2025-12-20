// You should first obtain the args received by this macro before continuing.
createRuler(...arg);
async function createRuler(distance, shape, macro, ...argz){

    if(!shape)
        shape = 'circle';

    let templateData = {
        t: shape,
        user: game.user.id,
        distance: distance,
        direction: 0,
        target: {},
        x: 0,
        y:0,
        fillColor: game.user.color
    }

    switch(shape){
        case "cone":
            templateData.angle = 45;
            break;
        case "rect":
            templateData.distance = Math.hypot(distance, distance);
            templateData.width = distance;
            templateData.direction = 45;
            break;
/*        case "ray":
            templateData.width = 1;
            break;
*/
        default:
            templateData.width = 1;
            break;
    }

    const template = new MeasuredTemplateDocument(templateData, {parent: canvas.scene});
    const object = new MeasuredTemplate(template);

    const initialLayer = canvas.activeLayer;
    // Draw the template and switch to the template layer
    object.draw();
    object.layer.activate();
    object.layer.preview.addChild(object);

    const handlers = {};

    let moveTime = 0;

    // Update placement (mouse-move)
    handlers.mm = event => {
        event.stopPropagation();
        let now = Date.now(); // Apply a 20ms throttle
        if ( now - moveTime <= 20 ) return;
        const center = event.data.getLocalPosition(object.layer);
        const snapped = canvas.grid.getSnappedPosition(center.x, center.y, 2);

        if ( game.release.generation < 10 ) 
            object.data.update({x: snapped.x, y: snapped.y});
        else 
            object.document.updateSource({x: snapped.x, y: snapped.y});

        object.refresh();
        moveTime = now;
    };

    // Cancel the workflow (right-click)
    handlers.rc = event => {
        object.layer._onDragLeftCancel(event);
        canvas.stage.off("mousemove", handlers.mm);
        canvas.stage.off("mousedown", handlers.lc);
        canvas.app.view.oncontextmenu = null;
        canvas.app.view.onwheel = null;
        initialLayer.activate();
        object.actorSheet?.maximize();
    };

    // Confirm the workflow (left-click)
    handlers.lc = event => {
        handlers.rc(event);
        const destination = canvas.grid.getSnappedPosition(object.data.x, object.data.y, 2);

        if ( game.release.generation < 10 ) 
            object.data.update(destination);
        else 
            object.document.updateSource(destination);

        canvas.scene.createEmbeddedDocuments("MeasuredTemplate", [object.data.toObject()]);
        
        let targetMap;
        let targetsIds = [];
        const gridPixels = canvas.scene.data.grid;
        const gridDistance = canvas.scene.data.gridDistance;
        const radius = (distance/gridDistance)*gridPixels;
        let tokens = game.canvas.tokens.placeables;
        
        switch(shape){
            case 'circle':                
                targetMap = [...tokens.entries()].filter(([key, val]) => {
                    let bounds = [
                        {x: val.bounds.left, y: val.bounds.top},
                        {x: val.bounds.right, y: val.bounds.top},
                        {x: val.bounds.left, y: val.bounds.bottom},
                        {x: val.bounds.right, y: val.bounds.bottom},
                        val.center
                    ]

                    for(const point of bounds){
                        if(isInsideCircle(destination, radius, point))
                            return true;
                    }

                });
                break;
            case 'cone':
                // Object rotation in the X axis
                const rotation = Math.toRadians(object.data.direction + 360);

                // Angle of the opening of the cone, divided by 2 since the rotation is right at the middle of the cone.
                const internalHalf = Math.toRadians(object.data.angle / 2); 

                // "Lower" end of the cone
                let extremeA = {
                    x: destination.x + (radius * Math.cos(rotation + internalHalf)),
                    y: destination.y + (radius * Math.sin(rotation + internalHalf))
                };

                // "Upper" end of the cone
                let extremeB = {
                    x: destination.x + (radius * Math.cos(rotation - internalHalf)),
                    y: destination.y + (radius * Math.sin(rotation - internalHalf))
                };

                targetMap = [...tokens.entries()].filter(([key, val]) => {
                    let bounds = [
                        {x: val.bounds.left, y: val.bounds.top},
                        {x: val.bounds.right, y: val.bounds.top},
                        {x: val.bounds.left, y: val.bounds.bottom},
                        {x: val.bounds.right, y: val.bounds.bottom},
                        val.center
                    ]

                    for(const point of bounds){
                        if(!isClockwise(destination, point, extremeA) 
                            && isClockwise(destination, point, extremeB) 
                            && isInsideCircle(destination, radius, point)){
                                return true;
                            }
                    }
                });
                break;
            case 'rect':
                const rectangle = object.ray.bounds;

                targetMap = [...tokens.entries()].filter(([key, val]) => {
                    let bounds = [
                        {x: val.bounds.left, y: val.bounds.top},
                        {x: val.bounds.right, y: val.bounds.top},
                        {x: val.bounds.left, y: val.bounds.bottom},
                        {x: val.bounds.right, y: val.bounds.bottom},
                        val.center
                    ]
                    for(const point of bounds){
                        if(isInsideRectangle(point, rectangle))
                            return true;
                    }
                });

                break;
            case 'ray':
                const A = object.ray.A;
                const B = object.ray.B;

                targetMap = [...tokens.entries()].filter(([key, val]) => {
                    
                    let C = {x: val.bounds.left, y: val.bounds.top};
                    let D = {x: val.bounds.right, y: val.bounds.top};
                    let E = {x: val.bounds.left, y: val.bounds.bottom};
                    let F = {x: val.bounds.right, y: val.bounds.bottom};
                    
                    return doLinesIntersect(A,B,C,D) 
                        || doLinesIntersect(A,B,D,E) 
                        || doLinesIntersect(A,B,E,F) 
                        || doLinesIntersect(A,B,F,C)
                });

                break;
            default:
                break;
            
        }
        if(targetMap.length)
            targetMap.forEach(target => { targetsIds.push(target[1].id) });

        if(targetsIds.length)
            game.user.updateTokenTargets(targetsIds);

        if(macro)
            game.macros.getName(macro).execute(destination, argz);

        initialLayer.activate();
    };

    // Rotate the template by 3 degree increments (mouse-wheel)
    handlers.mw = event => {
        if ( event.ctrlKey ) 
            event.preventDefault(); // Avoid zooming the browser window

        event.stopPropagation();
        let delta = canvas.grid.type > CONST.GRID_TYPES.SQUARE ? 30 : 15;
        let snap = event.shiftKey ? delta : 5;
        const update = {direction: object.data.direction + (snap * Math.sign(event.deltaY))};
        
        if ( game.release.generation < 10 ) 
            object.data.update(update);
        else 
            object.document.updateSource(update);

        object.refresh();
    };

    // Activate listeners
    canvas.stage.on("mousemove", handlers.mm);
    canvas.stage.on("mousedown", handlers.lc);
    canvas.app.view.oncontextmenu = handlers.rc;
    canvas.app.view.onwheel = handlers.mw;

}

function doLinesIntersect(a, b, c, d){
    // Lines are parallel
    if (areLinesParallel(a,b,c,d)) return false;

    // The code below was shamelessly copy and pasted from the internet and it works flawlessly.
    // I suck at geometry and couldn't figure it out myself. bite me.
	let a1, a2, b1, b2, c1, c2;
	let r1, r2 , r3, r4;
	let denom;

	a1 = b.y - a.y;
	b1 = a.x - b.x;
	c1 = (b.x * a.y) - (a.x * b.y);

	r3 = ((a1 * c.x) + (b1 * c.y) + c1);
	r4 = ((a1 * d.x) + (b1 * d.y) + c1);

	if ((r3 !== 0) && (r4 !== 0) && Math.sign(r3) == Math.sign(r4))
		return false;
	
	a2 = d.y - c.y;
	b2 = c.x - d.x;
	c2 = (d.x * c.y) - (c.x * d.y);

	r1 = (a2 * a.x) + (b2 * a.y) + c2;
	r2 = (a2 * b.x) + (b2 * b.y) + c2;

	if ((r1 !== 0) && (r2 !== 0) && Math.sign(r1) == Math.sign(r2))
		return false;

	denom = (a1 * b2) - (a2 * b1);
	if (denom === 0) {
		return true;
	}

	return true;
}

function isInsideCircle(center, radius, point){
    return Math.sqrt((point.x - center.x) **2 + (point.y - center.y) **2) <= radius;
}

function isInsideRectangle(point, rectangle){
    return !(point.x < rectangle.left || point.x > rectangle.right || point.y > rectangle.bottom || point.y < rectangle.top);
}

function isClockwise(origin, point, anchor){
    return (point.y - origin.y) * (anchor.x - point.x) - (point.x - origin.x) * (anchor.y - point.y) >= 0
}