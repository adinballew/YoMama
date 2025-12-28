# Troubleshooting Guide

## Build Issues

### Error: Failed retrieving 'danctnix.db' from p64.arikawa-hi.me

If you encounter the following error when building this app on Arch Linux ARM or Pine64 devices:

```
error: failed retrieving file 'danctnix.db' from p64.arikawa-hi.me : Resolving timed out after 10000 milliseconds
error: failed to synchronize all databases (download library error)
```

This error occurs because the old danctnix repository mirror (`p64.arikawa-hi.me`) has expired and is no longer available.

#### Solution

Update your pacman configuration to use the new official mirror:

1. **Update the repository URL:**
   
   Replace all occurrences of `p64.arikawa-hi.me` with `archmobile.mirror.danctnix.org` in your `/etc/pacman.conf` file:

   ```bash
   sudo sed -i 's|p64.arikawa-hi.me|archmobile.mirror.danctnix.org|g' /etc/pacman.conf
   ```

2. **Refresh the package database:**

   ```bash
   sudo pacman -Syy
   ```

3. **Update your system:**

   ```bash
   sudo pacman -Syu
   ```

#### Additional Troubleshooting

If you continue to experience timeout issues after updating the mirror URL:

- **Update your mirror list:**
  ```bash
  sudo pacman -Syu pacman-mirrorlist
  ```

- **Check your internet connection** and ensure your DNS is working properly

- **Try using alternative DNS servers** (e.g., Google DNS: 8.8.8.8 and 8.8.4.4)

- **Check if your firewall or ISP is blocking access** to the repository

#### References

- [Danctnix Pine64-Arch Issue #598](https://github.com/dreemurrs-embedded/Pine64-Arch/issues/598)
- [Pine64 Forum Discussion](https://forum.pine64.org/showthread.php?tid=20087)

## Other Build Issues

If you encounter other build issues, please check the following:

- Ensure you have the latest version of Node.js and npm installed
- Run `npm install` to install all dependencies
- Clear the Expo cache: `npx expo start -c`
- For EAS builds, ensure your `eas.json` configuration is correct
