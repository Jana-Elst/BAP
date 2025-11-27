//-------------------- IMPORTS --------------------//
import { Animated, PanResponder, Dimensions, Platform } from 'react-native';
//-------------------- EXPORT --------------------//
export const InfiniteGrid = ({ sources, data, originalSize, onItemsUpdate }) => {
    //-------------------- VARIABLES --------------------//
    let scroll = {
        ease: 0.5,
        current: { x: 0, y: 0 }, //moveX and moveY
        target: { x: 0, y: 0 },
        last: { x: 0, y: 0 },
        delta: { x: { c: 0, t: 0 }, y: { c: 0, t: 0 } } //dx and dy
    };

    let items = [];
    let animationFrameId = null; //UUHMMM
    let isDestroyed = false; //UUHMMM

    let winW
    let winH
    let tileSize;

    //-------------------- HELPER FUNCTIONS --------------------//
    const onResize = ({ sources, data, originalSize, onItemsUpdate }) => {
        const { width: w, height: h } = Dimensions.get('window');
        winW = w;
        winH = h;

        tileSize = {
            w: winW,
            h: (winW) * (originalSize.h / originalSize.w),
        };

        scroll.current = { x: 0, y: 0 };
        scroll.target = { x: 0, y: 0 };
        scroll.last = { x: 0, y: 0 };

        const baseItems = data.map((d, i) => {
            const scaleX = tileSize.w / originalSize.w;
            const scaleY = tileSize.h / originalSize.h;
            const source = sources[i % sources.length];
            return {
                src: source,
                x: d.x * scaleX,
                y: d.y * scaleY,
                w: d.w * scaleX,
                h: d.h * scaleY
            };
        });

        items = [];
        const repsX = [0, tileSize.w];
        const repsY = [0, tileSize.h];

        baseItems.forEach((base, baseIndex) => {
            repsX.forEach(offsetX => {
                repsY.forEach(offsetY => {
                    items.push({
                        id: `${baseIndex}-${offsetX}-${offsetY}`,
                        src: base.src,
                        x: base.x + offsetX,
                        y: base.y + offsetY,
                        w: base.w,
                        h: base.h,
                        extraX: 0,
                        extraY: 0,
                        ease: Math.random() * 0.5 + 0.5,
                    });
                });
            });
        });

        tileSize.w *= 2;
        tileSize.h *= 2;

        scroll.current.x = scroll.target.x = scroll.last.x = -winW * 0.1;
        scroll.current.y = scroll.target.y = scroll.last.y = -winH * 0.1;

        // updateItems();
    }

    const onScroll = (deltaX, deltaY) => {
        scroll.target.x -= deltaX;
        scroll.target.y -= deltaY;
    }

    //render...???
    const updateItems = () => {
        //let start scrolling
        scroll.current.x += (scroll.target.x - scroll.current.x);
        scroll.current.y += (scroll.target.y - scroll.current.y);

        //determine scroll direction
        const dirX = scroll.current.x > scroll.last.x ? 'right' : 'left';
        const dirY = scroll.current.y > scroll.last.y ? 'down' : 'up';

        const updatedItems = items.map(item => {
            //how far did the user scroll?
            const scrollX = scroll.current.x;
            const scrollY = scroll.current.y;

            //current position
            const posX = item.x + scrollX + item.extraX;
            const posY = item.y + scrollY + item.extraY;

            //infinite wrap horizontal
            const beforeX = posX > winW;
            const afterX = posX + item.w < 0;
            if (dirX === 'right' && beforeX) item.extraX -= tileSize.w;
            if (dirX === 'left' && afterX) item.extraX += tileSize.w;

            //infinite wrap vertical
            const beforeY = posY > winH;
            const afterY = posY + item.h < 0;
            if (dirY === 'down' && beforeY) item.extraY -= tileSize.h;
            if (dirY === 'up' && afterY) item.extraY += tileSize.h;

            //final positions
            const fx = item.x + scrollX + item.extraX;
            const fy = item.y + scrollY + item.extraY;

            return {
                ...item,
                extraX: item.extraX,
                extraY: item.extraY,
                translateX: fx,
                translateY: fy,
            };
        });

        scroll.last.x = scroll.current.x;
        scroll.last.y = scroll.current.y;

        items = updatedItems;
        onItemsUpdate(updatedItems);

        if (!isDestroyed) {
            animationFrameId = requestAnimationFrame(() => updateItems());
        }
    }

    const start = () => {
        updateItems();
    }

    const destroy = () => {
        isDestroyed = true;
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
        }
    }

    //-------------------- INIT --------------------//
    onResize({ sources, data, originalSize, onItemsUpdate });

    return { onScroll, start, destroy };
}