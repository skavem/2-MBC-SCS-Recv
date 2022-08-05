const WSIP = '192.168.1.100'
const WSPort = '8765'

const initialFontSizePercentsVerses = 500
const initialFontSizePercentsCouplets = 700

const $coupletblock = $('#coupletblock')
const $couplet = $('#couplet')
const $verseblock = $('#verseblock')
const $verse = $('#verse')

$coupletblock.fadeOut()
$verseblock.fadeOut()

const sendWithWS = (ws, obj) => ws.send(JSON.stringify(obj))

const setVerseText = text => {
  $verse.text(text)
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

const resizeElementFont = (el, initSize) => {
  function getSize(initSize) {
    el.css('overflow', 'scroll')
    el.css('font-size', initSize + '%')
    const h = el.height()
    const sh = el.prop('scrollHeight')
    const fSize = h / sh * initSize
    console.log(h, sh, fSize)
    el.css('overflow', '')
    return fSize
  }

  let fSize = getSize(initSize)
  el.css('font-size', fSize + '%')
}

const handleMessage = message => {
  message = JSON.parse(message)
  console.log(message)
  const handlerFunc = {
    show: {
      verse: () => {
        setVerseText(message.data.verse.text)
        setElVisibility($verseblock, true)
        resizeElementFont($verse, initialFontSizePercentsVerses)
      },
      couplet: () => {
        setCoupletText(message.data.couplet.text)
        setElVisibility($coupletblock, true)
        resizeElementFont($couplet, initialFontSizePercentsCouplets)
      }
    }[message.object],
    hide: {
      verse: () => {
        setElVisibility($verseblock, false)
      },
      couplet: () => {
        setElVisibility($coupletblock, false)
      }
    }[message.object],
    answer: {
      auth: () => {
        if (message.data.verse !== undefined) {
          setVerseText(message.data.verse.verse.text)
          setElVisibility($verseblock, true)
          resizeElementFont($verse, initialFontSizePercentsVerses)
        }
        if (message.data.couplet !== undefined) {
          setCoupletText(message.data.couplet.couplet.text)
          setElVisibility($coupletblock, true)
          resizeElementFont($couplet, initialFontSizePercentsCouplets)
        }
      }
    }[message.object]
  }[message.type]

  handlerFunc()
}

const ws = new WebSocket(`ws://${WSIP}:${WSPort}`)
ws.onopen = () => sendWithWS(ws, {
  type: "reciever",
  object: "auth",
  data: ""
})
ws.onmessage = mess => handleMessage(mess.data)