// import React from 'react'
// import Posts from './Posts'
// import { useSelector } from 'react-redux'

// const Feed = () => {
//   const { showSmwaad } = useSelector(store => store.ui);

//   return (
//     <div className='flex-1 my-8 flex flex-col items-center pl-[20%]'>
//       {showSmwaad ? (
//         <iframe
//           src="https://multilingualtexttosignlanguage-ox3j.vercel.app"
//           className="w-[90%] h-[80vh] rounded-lg border"
//           title="Smwaad"
//         />
//       ) : (
//         <Posts />
//       )}
//     </div>
//   )
// }

// export default Feed

import React from 'react'
import Posts from './Posts'
import { useSelector, useDispatch } from 'react-redux'
import { setShowSmwaad } from '@/redux/uiSlice'

const Feed = () => {
  const { showSmwaad } = useSelector(store => store.ui);
  const dispatch = useDispatch();

  return (
    <div className='flex-1 my-8 flex flex-col items-center pl-[20%]'>
      {showSmwaad ? (
        <>
          <button
            onClick={() => dispatch(setShowSmwaad(false))}
            className="mb-4 px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors"
          >
            Back to Feed
          </button>
          <iframe
            src="https://multilingualtexttosignlanguage-ox3j.vercel.app"
            className="w-[90%] h-[80vh] rounded-lg border"
            title="Smwaad"
          />
        </>
      ) : (
        <Posts />
      )}
    </div>
  );
};

export default Feed;




