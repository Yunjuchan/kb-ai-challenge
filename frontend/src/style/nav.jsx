import styled from 'styled-components';

export const StyledNavbar = styled.nav`
  position: fixed;
  top: 50px;
  right: 400px;
  width: 100px;
  display: flex;
  justify-content: space-around;
  /* background-color: #333; */
  padding: 10px 0;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  /* z-index: 1000; */

  button {
    width: 10px;
    height: 10px;
    background-color: #555;
    color: white;
    border: none;
    padding: 10px 20px;
    cursor: pointer;
    transition: background-color 0.3s;

    &:hover {
      background-color: #777;
    }
  }
`;
