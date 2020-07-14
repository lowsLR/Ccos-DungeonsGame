// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
	extends: cc.Component,

	properties: {
		mapNode: cc.Node,
		dialogNode: cc.Node
	},

	// LIFE-CYCLE CALLBACKS:

	onLoad() {
		// 物理系统 
		let p = cc.director.getPhysicsManager();
		p.enabled = true;
		// p.debugDrawFlags = true;
		p.gravity = cc.v2(0, 0)
		// cc.director.getCollisionManager().enabled = true;
		// cc.director.getCollisionManager().enabledDebugDraw = true;
		//存放地图类型
		let mapNodeArr = [
			['00000', '01000', '00000'],
			['00010', '11110', '00100'],
			['00000', '10000', '00000'],
		]
		this.initMap(mapNodeArr);
	},
	//根据地图类型随机生成地图
	initMap(mapNodeArr) {
		let mapSt = null; //地图资源第一块 
		for (let i = 0; i < mapNodeArr.length; i++) {
			for (let j = 0; j < mapNodeArr[i].length; j++) {
				let mapName = mapNodeArr[i][j];
				if (!mapName || mapName == '00000') continue;
				if (!mapSt) {
					mapSt = {
						i,
						j
					};
				}
				cc.loader.loadRes(`map/${mapName}`, cc.TiledMapAsset, (err, assets) => {
					let node = new cc.Node();
					let map = node.addComponent(cc.TiledMap);
					node.anchorX = node.anchorY = 0;
					node.x = (j - mapSt.j) * 384;
					node.y = -(i - mapSt.i) * 384;
					map.tmxAsset = assets;
					node.parent = this.mapNode;
					this.initNodeNode(node);
				})
			}
		}
	},
	initNodeNode(mapNode) {
		//获取整个地图的子节点 
		let tiledMap = mapNode.getComponent(cc.TiledMap);
		// 获取地图背景中 tile 元素的大小。
		let tiledSize = tiledMap.getTileSize();
		// 获取指定名称的 layer
		let layer = tiledMap.getLayer('wall');
		// 获得层大小
		let layerSize = layer.getLayerSize();
		// cc.log(layer, "==>获取指定名称的")
		// cc.log(tiledSize, "==>获取地图背景中");
		//获取迷雾区
		// let somLayer = tiledMap.getLayer('smog');
		// somLayer.node.active = true;

		for (let i = 0; i < layerSize.width; i++) {
			for (let j = 0; j < layerSize.height; j++) {
				// 通过指定的 tile 坐标获取对应的 TiledTile。
				let tiled = layer.getTiledTileAt(i, j, true);
				// cc.log(tiled,"===> 坐标获取")
				if (tiled.gid != 0) {
					tiled.node.group = 'wall' //修改物理碰撞的组件
					let body = tiled.node.addComponent(cc.RigidBody); //addComponent 添加组件 
					body.type = cc.RigidBodyType.Static;
					let collider = tiled.node.addComponent(cc.PhysicsBoxCollider);
					// cc.log(collider,"===?添加")
					collider.offset = cc.v2(tiledSize.width / 2, tiledSize.height / 2);
					collider.size = tiledSize;
					collider.apply();
				}
				// tiled = somLayer.getTiledTileAt(i, j, true);
				// if (tiled.gid != 0) {
				// 	tiled.node.group = 'smog'
				// 	let collider = tiled.node.addComponent(cc.BoxCollider);
				// 	collider.offset = cc.v2(tiledSize.width / 2, tiledSize.height / 2);
				// 	collider.size = tiledSize; 
				// } 
			}
		}
	},
	start() {
		this.dialog = this.dialogNode.getComponent('dialog');
		// for (let mapNode of this.mapNode.children) {
		// 	this.initNodeNode(mapNode) 
		// }
	},

	// update (dt) {}, 
});
