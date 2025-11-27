import { Animated, PanResponder, Dimensions, Platform } from 'react-native';

export class InfiniteGrid {
    constructor({ sources, data, originalSize, onItemsUpdate }) {
        this.sources = sources;
        this.data = data;
        this.originalSize = originalSize;
        this.onItemsUpdate = onItemsUpdate;

        this.scroll = {
            ease: 0.085,
            current: { x: 0, y: 0 },
            target: { x: 0, y: 0 },
            last: { x: 0, y: 0 },
        };

        this.items = [];
        this.animationFrameId = null;
        this.isDestroyed = false;

        this.onResize();
    }

    onResize() {
        const { width: winW, height: winH } = Dimensions.get('window');
        this.winW = winW;
        this.winH = winH;

        this.tileSize = {
            w: this.winW,
            h: (this.winW) * (this.originalSize.h / this.originalSize.w),
        };

        this.scroll.current = { x: 0, y: 0 };
        this.scroll.target = { x: 0, y: 0 };
        this.scroll.last = { x: 0, y: 0 };

        const baseItems = this.data.map((d, i) => {
            const scaleX = this.tileSize.w / this.originalSize.w;
            const scaleY = this.tileSize.h / this.originalSize.h;
            const source = this.sources[i % this.sources.length];
            return {
                src: source,
                x: d.x * scaleX,
                y: d.y * scaleY,
                w: d.w * scaleX,
                h: d.h * scaleY
            };
        });

        this.items = [];
        const repsX = [0, this.tileSize.w];
        const repsY = [0, this.tileSize.h];

        baseItems.forEach((base, baseIndex) => {
            repsX.forEach(offsetX => {
                repsY.forEach(offsetY => {
                    this.items.push({
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

        this.tileSize.w *= 2;
        this.tileSize.h *= 2;

        this.scroll.current.x = this.scroll.target.x = this.scroll.last.x = -this.winW * 0.1;
        this.scroll.current.y = this.scroll.target.y = this.scroll.last.y = -this.winH * 0.1;

        this.updateItems();
    }

    onScroll(deltaX, deltaY) {
        this.scroll.target.x -= deltaX;
        this.scroll.target.y -= deltaY;
    }

    updateItems() {
        //let start scrolling
        this.scroll.current.x += (this.scroll.target.x - this.scroll.current.x) * this.scroll.ease;
        this.scroll.current.y += (this.scroll.target.y - this.scroll.current.y) * this.scroll.ease;

        //determine scroll direction
        const dirX = this.scroll.current.x > this.scroll.last.x ? 'right' : 'left';
        const dirY = this.scroll.current.y > this.scroll.last.y ? 'down' : 'up';

        const updatedItems = this.items.map(item => {
            const scrollX = this.scroll.current.x;
            const scrollY = this.scroll.current.y;

            let { extraX, extraY } = item;

            //current position
            const posX = item.x + scrollX + extraX;
            const posY = item.y + scrollY + extraY;

            //infinite wrap horizontal
            const beforeX = posX > this.winW;
            const afterX = posX + item.w < 0;
            if (dirX === 'right' && beforeX) extraX -= this.tileSize.w;
            if (dirX === 'left' && afterX) extraX += this.tileSize.w;

            //infinite wrap vertical
            const beforeY = posY > this.winH;
            const afterY = posY + item.h < 0;
            if (dirY === 'down' && beforeY) extraY -= this.tileSize.h;
            if (dirY === 'up' && afterY) extraY += this.tileSize.h;

            //final positions
            const fx = item.x + scrollX + extraX;
            const fy = item.y + scrollY + extraY;

            return {
                ...item,
                extraX,
                extraY,
                translateX: fx,
                translateY: fy,
            };
        });

        this.items = updatedItems;
        this.onItemsUpdate(updatedItems);

        //store position for the next frame
        this.scroll.last.x = this.scroll.current.x;
        this.scroll.last.y = this.scroll.current.y;

        if (!this.isDestroyed) {
            this.animationFrameId = requestAnimationFrame(() => this.updateItems());
        }
    }

    start() {
        this.updateItems();
    }

    destroy() {
        this.isDestroyed = true;
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
        }
    }
}