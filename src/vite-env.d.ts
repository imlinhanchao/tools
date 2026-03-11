/// <reference types="vite/client" />

declare module 'sm-crypto' {
  interface SM2 {
    generateKeyPairHex(): { privateKey: string; publicKey: string }
    doEncrypt(msg: string, publicKey: string, cipherMode?: number): string
    doDecrypt(encryptedHex: string, privateKey: string, cipherMode?: number): string
  }
  interface SM4EncryptOptions {
    inputEncoding?: 'utf8' | 'hex' | 'base64'
    outputEncoding?: 'hex' | 'base64'
  }
  interface SM4DecryptOptions {
    inputEncoding?: 'hex' | 'base64'
    outputEncoding?: 'utf8' | 'hex' | 'base64'
  }
  interface SM4 {
    encrypt(plaintext: string, key: string, options?: SM4EncryptOptions): string
    decrypt(ciphertext: string, key: string, options?: SM4DecryptOptions): string
  }
  const smCrypto: { sm2: SM2; sm4: SM4 }
  export default smCrypto
}
