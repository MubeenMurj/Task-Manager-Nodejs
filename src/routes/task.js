const express = require("express")
const Tasks = require("../models/task")
const auth = require("../middleware/auth")

const router = new express.Router()

router.post("/tasks", auth, async (req, res) => {
	const tasks = new Tasks({
		...req.body,
		owner: req.user._id,
	})

	try {
		await tasks.save()
		res.status(201).send(tasks)
	} catch (e) {
		res.status(400).send(e)
	}
})

router.get("/tasks", auth, async (req, res) => {
	try {
		const tasks = await Tasks.find({ owner: req.user._id })
		res.status(201).send(tasks)
	} catch (e) {
		res.status(500).send(e)
	}
})

router.get("/tasks/:id", auth, async (req, res) => {
	const _id = req.params.id

	try {
		await req.user.populate("tasks").execPopulate()

		res.status(201).send(tasks)
	} catch (e) {
		res.status(500).send(e)
	}
})

router.patch("/tasks/:id", auth, async (req, res) => {
	const updates = Object.keys(req.body)
	const allowedUpdates = ["description", "completed"]
	const isValidOperation = updates.every((update) =>
		allowedUpdates.includes(update)
	)

	if (!isValidOperation) return res.status(400).send()

	try {
		const task = await Tasks.findOne({
			_id: req.params._id,
			owner: req.user._id,
		})

		if (!task) return res.status(404).send()

		updates.forEach((update) => (task[update] = req.body[update]))
		await task.save()

		res.status(201).send(task)
	} catch (e) {
		res.status(400).send(e)
	}
})

router.delete("/tasks/:id", auth, async (req, res) => {
	try {
		const task = await Tasks.findOneAndDelete({
			_id: req.params._id,
			owner: req.body._id,
		})

		if (!task) return res.status(404).send()

		res.status(201).send(task)
	} catch (e) {
		res.status(500).send(e)
	}
})

module.exports = router
