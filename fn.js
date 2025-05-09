async function fn(get, req, res) {
	const data = await get(req[get.type])

	if (!res.headersSent) {
		if (data.contentType) {
			res.setHeader('Content-Type', data.contentType)
			if (data.stream) {
	// kalau ternyata bukan stream, kirim langsung pakai Buffer
			res.send(data.data)
			} else {
			res.send(data.data)
		}

			res.status(parseInt(data.code))
		} else {
			res.status(parseInt(data.code)).json(data)
		}
	}

	return
}

module.exports = fn 