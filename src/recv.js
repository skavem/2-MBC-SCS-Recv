const $ = require('jquery')

const WSIP = '192.168.1.100'
const WSPort = '8765'

const maxFontSizeForVersesEms = 5
const maxFontSizeCoupletsEms = 15

const $coupletblock = $('#coupletblock')
const $couplet = $('#couplet')
const $verseblock = $('#verseblock')
const $verse = $('#verse')

$coupletblock.fadeOut()
$verseblock.fadeOut()


const setVerseText = text => {
  $verse.text(text)
}

const addReferenceToVerse = reference => {
  const newRef = $('<div></div>')
    .text(`${reference.book} ${reference.chapter}:${reference.verse}`)
    .css("text-align", "right")
    .css("font-size", "0.6em")
  $verse.append(newRef)
}

const setCoupletText = text => {
  $couplet.text(text)
}

const setElVisibility = (el, vis) => {
  if (vis) {
    el.fadeIn()
  } else {
    el.fadeOut()
  }
}

const getBestSize = (
  verseElement,
  start = 1,
  end = maxFontSizeForVersesEms,
  partOfScreenToFitInto = 0.5
) => {
  if (Math.abs(start - end) < 0.1) return start
  
  const size = start + (end - start) / 2

  verseElement.css('font-size', size + 'em')

  const halfWindowSize = $(window).height() * partOfScreenToFitInto
  const elementScrollHeight = verseElement.prop('scrollHeight')

  if (elementScrollHeight < halfWindowSize) {
    return getBestSize(verseElement, size, end, partOfScreenToFitInto) + 'em'
  } else {
    return getBestSize(verseElement, start, size, partOfScreenToFitInto) + 'em'
  }
}

const showVerse = (verse) => {
  setVerseText(verse.verse.text)
  setElVisibility($verseblock, true)
  $verse.css('font-size', getBestSize($verse))
  addReferenceToVerse(verse.reference)
}

const showCouplet = (couplet) => {
  setCoupletText(couplet)
  setElVisibility($coupletblock, true)
  $couplet.css('font-size', getBestSize($couplet, 1, maxFontSizeCoupletsEms, 0.6))
}

const handleMessage = message => {
  message = JSON.parse(message)
  console.log(message)
  const handlerFunc = {
    show: {
      verse: () => {
        showVerse(message.data)
      },
      couplet: () => {
        showCouplet(message.data.couplet.text)
      }
    },
    hide: {
      verse: () => {
        setElVisibility($verseblock, false)
      },
      couplet: () => {
        setElVisibility($coupletblock, false)
      }
    },
    answer: {
      auth: () => {
        if (message.data.verse !== undefined) {
          showVerse(message.data.verse)
        }
        if (message.data.couplet !== undefined) {
          showCouplet(message.data.couplet.couplet.text)
        }
      }
    }
  }[message.type][message.object]()
}

const sendWithWS = (ws, obj) => ws.send(JSON.stringify(obj))

const ws = new WSWrapper(WSIP, WSPort)

function WSWrapper(WSIP, WSPort) {
  this._ws = new WebSocket(`ws://${WSIP}:${WSPort}`)

  this.onopen = () => sendWithWS(this._ws, {
    type: "reciever",
    object: "auth",
    data: ""
  })
  this.onmessage = mess => handleMessage(mess.data)
  this.onclose = () => {
    setTimeout(() => {
      this._ws = new WebSocket(`ws://${WSIP}:${WSPort}`)
      this._ws.onopen = this.onopen
      this._ws.onmessage = this.onmessage
      this._ws.onclose = this.onclose
    }, 1000)
  }

  this._ws.onopen = this.onopen
  this._ws.onmessage = this.onmessage
  this._ws.onclose = this.onclose
  
  this.send = this._ws.send
}