import kaboom from "kaboom"

const k = kaboom()

k.setBackground(121,45,73)

k.loadSprite("bean", "sprites/bean.png")

k.add([
	k.pos(120, 80),
	k.sprite("bean"),
])

k.onClick(() => k.addKaboom(k.mousePos()))