
'use strict'

$(function() {

  const dataURL = 'https://pinjin1201.github.io/life_quiz/life_quiz.json'
  const $start = $('.start')
  const $input = $('input[type="text"]')
  const $enterBtn = $('.enter-btn')
  const $detail = $('div.detail')
  const $nextBtn = $('div.next-btn')
  const $detailFrom = $('div.from')
  const $againBtn = $('.again-btn')
  const $copyright = $('.score-copyright')
  let $question = ''
  let $options = ''

  // hide element
  function hideBlock() {
    $detail.hide()
    $nextBtn.hide()
    $detailFrom.hide()
    $againBtn.hide()
    $copyright.hide()
  }
  hideBlock()

  let name = ''
  let data = ''
  let dataArray = []
  let questionNumber = 0
  let score = 0
  const scoreWord = {
    one: '聰明如愛因斯坦的你，很不錯喔!',
    two: '你簡直就像神機妙算的諸葛孔明一樣!',
    three: '生活常識真是難不倒你! 做得好',
    four: '不錯喔! 也考考你的朋友吧!',
    five: '是不是又多了些知識呢，很有趣對吧!',
    six: '今天是不是得到了許多知識，意想不到吧!'
  }

  //// MAKE QUIZ--
  // add items letter title
  function addItemTitleLetter(num, title) {
    for (let i = 0; i < num; i++) {
      const $item = $(`div.options .item:nth-child(${[i + 1]})`)
      const text = $item.text()
      $item.text(`${title[i] + text}`)
    }
  }
  // render items text
  function renderItemText(array, title) {
    let content = ``
    const number = array.length
    // take a random item in content
    for (let i = 0; i < number; i++) {
      const itemIndex = Math.floor(Math.random() * array.length)
      content += array[itemIndex]
      array.splice(itemIndex, 1)
    }
    // show content
    $options.html(content)
    // add items letter title
    addItemTitleLetter(number, title)
  }
  // put all items in itemArray
  function putItemInArray(array, num, itemNum) {
    // wrong items in itemArray
    for (let i = 0; i < itemNum; i++) {
      array.push(`<div class="item" data-id="${data[num].id}">${data[num].wrong[i]}</div>`)
    }
    // answer item in itemArray
    array.push(`<div class="answer item" data-id="${data[num].id}" data-item="answer">${data[num].answer}</div>`)
  }
  // show options text
  function showOptionText(number) {
    // calculate wrong items amount
    const itemLength = data[number].wrong.length
    // all items there
    let itemArray = []
    // items title
    const letter = ['A. ', 'B. ', 'C. ', 'D. ', 'E. ', 'F. ', 'G. ', 'H. ', 'I. ', 'J. ', 'K. ', 'L. ', 'M. ', 'N. ', 'O. ']
    // put all items in itemArray
    putItemInArray(itemArray, number, itemLength)
    // render items text
    renderItemText(itemArray, letter)
  }
  // show question text
  function showQuestionText(number) {
    // make question title
    questionNumber += 1
    // show text
    $question.text(`${questionNumber}. ${data[number].question}`)
  }
  /// make test topic
  function makeTest() {
    if (data.length === 0) {
      return showScore()
    }
    $question = $('.topic .question')
    $options = $('.topic .options')

    // put data in dataArray
    if (dataArray.length === 0) {
      dataArray.push(...data)
    }
    // take out a random topic
    const topicIndex = Math.floor(Math.random() * data.length)
    // show question text
    showQuestionText(topicIndex)
    // show options text
    showOptionText(topicIndex)
    return topicIndex
  }

  //// CLICK ITEM--
  // item is right or not
  function clickedItems(itemArray) {

    // calculate quiz score
    function calculateScore(array) {
      if (score === 0) { score += 100 % array.length }
      let score_of_one = Math.floor(100 / array.length)
      score += score_of_one
      if (score >= 100) { score = 100 }
    }
    // add answer item background color
    function addAnswerItemStyle(item) {
      item.css('background-color', '#3CB371')
    }
    // add wrong item background color
    function addWrongItemStyle(item) {
      item.css('background-color', '#CD5C5C')
    }
    // remove options event listener
    function removeOptionEventListener(item) {
      item.parent().off('click')
    }
    // render detail image
    function renderDetailImage(itemArray, num) {
      const $image = $('.detail-image')
      $image.html(`<img src="${itemArray[num].image}" alt="detail-image"/>`)
    }
    // show next button and detail from
    function showNextBtn(itemArray, num) {
      const from = itemArray[num].detail_url
      $nextBtn.show()
      $detailFrom.show().text(from)
    }
    // show detail text
    function showDetailText(itemArray, number) {
      let content = `
          <div class="detail-image"></div>
          <div class="detail-text">${itemArray[number].detail}</div>
        `
      $detail.show().html(content)

      // show next button and detail from
      showNextBtn(itemArray, number)
      // render detail image
      renderDetailImage(itemArray, number)
    }

    /// item is answer or not
    $options.on('click', '.item', function (event) {
      const $this = $(this)
      const $answerItem = $this.parent().find('.answer')
      const answer = event.target.dataset.item
      const id = event.target.dataset.id

      if (answer === 'answer') {
        showDetailText(itemArray, Number(id))
        addAnswerItemStyle($answerItem)
        calculateScore(itemArray)
        removeOptionEventListener($this)
      } else {
        showDetailText(itemArray, Number(id))
        addAnswerItemStyle($answerItem)
        addWrongItemStyle($this)
        removeOptionEventListener($this)
      }
    })

  }

  //// SHOW QUIZ PAGE--
  function enterTestPage() {
    const content = `
      <div class="title-icon">♞</div>
      <div class="topic">
        <div class="question"></div>
        <div class="options"></div>
      </div>
    `
    $start.html(content)
    // make test topic
    const number = makeTest()
    // click item
    clickedItems(dataArray)
    // remove topic from data
    data.splice(number, 1)
  }

  //// START PAGE--
  // get name and enter test page
  $enterBtn.on('click', function (event) {
    const value = $input.val()
    const blankName = value.trim().length
    if (blankName === 0) {
      return alert('姓名不可為空')
    } else {
      name = value
      enterTestPage()
    }
  })

  //// NEXT QUIZ--
  // run next quiz
  $nextBtn.on('click', function (event) {
    enterTestPage()
    $detail.hide()
    $nextBtn.hide()
    $detailFrom.hide()
  })
  
  //// GET DATA--
  axios.get(dataURL)
    .then(response => {
      data = response.data.results
    })
    .catch(error => console.log(error))
})