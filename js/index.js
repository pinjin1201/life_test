
'use strict'

$(function() {

  const dataURL = 'https://pinjin1201.github.io/life_quiz/life_quiz.json'
  const $start = $('.start')
  const $input = $('input[type="text"]')
  const $detail = $('div.detail')
  const $nextBtn = $('div.next-btn')
  const $detailFrom = $('div.from')
  const $againBtn = $('.again-btn')
  const $copyright = $('.score-copyright')

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
  
  //// GET DATA--
  axios.get(dataURL)
    .then(response => {
      data = response.data.results
    })
    .catch(error => console.log(error))
})