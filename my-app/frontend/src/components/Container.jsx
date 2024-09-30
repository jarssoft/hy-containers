import update from 'immutability-helper'
import { useCallback, useState, useEffect } from 'react'
import { Card } from './Card.jsx'
const style = {
  width: 330,
}
export const Container = ({initCards, onMove, onChange}) => {
  {
    console.log(initCards);
    const [cards, setCards] = useState(
      onChange(
          initCards.map((card,i) => ({id:i, text:card})))
          .map((card,i) => ({id:i, text:card}))
      )

    useEffect(() => {
      onMove(cards)
    }, [cards]);

    const moveCard = useCallback((dragIndex, hoverIndex) => {
      
      setCards((prevCards) =>
        {
        
        const pal = update(prevCards, {
          $splice: [
            [dragIndex, 1],
            [hoverIndex, 0, prevCards[dragIndex]],
          ],
        })

        const uusilista = onChange(pal)

        for(let i=0; i<pal.length; i++){
          pal[i]={id:pal[i].id, text:<>{uusilista[pal[i].id]}</>}
        }

        return pal

      },
      )
    }, [])
    const renderCard = useCallback((card, index) => {
      
      return (
        <Card
          key={card.id}
          index={index}
          id={card.id}
          text={card.text}
          moveCard={moveCard}
        />
      )
    }, [])
    return (
      <>
        <div style={style}>{cards.map((card, i) => renderCard(card, i))}</div>
      </>
    )
  }
}