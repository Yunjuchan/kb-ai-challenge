import { createGlobalStyle } from 'styled-components';
import reset from 'styled-reset';

export const GlobalStyle = createGlobalStyle`
    ${reset}

    @font-face {
      font-family: 'Noto Sans KR';
      src: url('../assets/fonts/NotoSansKR-Regular.ttf') format('truetype');
      font-weight: normal;
      font-style: normal;
    }

    @font-face {
      font-family: 'Noto Sans KR';
      src: url('../assets/fonts/NotoSansKR-Bold.ttf') format('truetype');
      font-weight: bold;
      font-style: normal;
    }

    * {
        font-family: 'Noto Sans KR', 'Pretendard', sans-serif;
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }

    body, html {
        background-color: #d8d8d8;
        font-family: 'Noto Sans KR', 'Pretendard', sans-serif;
        font-size: 15px;
        overflow-y: scroll;
        -ms-overflow-style: none; /* 인터넷 익스플로러 */
        scrollbar-width: none; /* 파이어폭스 */
        color: #000; /* 기본 글꼴 색상 */

        &::-webkit-scrollbar {
            display: none; /* 크롬, 사파리, 오페라, 엣지 */
            width: 0; /* Remove scrollbar space */
            height: 0;
            background: transparent; /* Optional: just make scrollbar invisible */
            -webkit-appearance: none;
        }
    }

    #root {
        display: block;
        width: 100%;
        height: 100%;
        background-color: white;
    }
`;
