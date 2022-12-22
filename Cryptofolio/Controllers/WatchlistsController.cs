using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Cryptofolio.Data;
using Cryptofolio.Models;
using Microsoft.AspNetCore.OData.Routing.Controllers;
using Cryptofolio.Services;
using Microsoft.AspNetCore.OData.Query;
using Cryptofolio.ViewModels;
using System.Xml.Linq;
using Microsoft.AspNetCore.OData.Formatter;
using Microsoft.AspNetCore.OData.Deltas;

namespace Cryptofolio.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class WatchlistsController : ODataController
    {
        private readonly ApplicationDbContext _context;
        private readonly IUserAuthService _userAuthService;

        public WatchlistsController(ApplicationDbContext context, IUserAuthService userAuthService)
        {
            _context = context;
            _userAuthService = userAuthService;
        }

        // GET: api/Watchlists
        [EnableQuery]
        [HttpGet("/odata/Watchlists")]
        public async Task<ActionResult<WatchlistDTO>> GetWatchlists()
        {
            if (_context.Watchlists == null && _userAuthService.getCurrentUserId() == null)
            {
                return NotFound();
            }

            Watchlist watchlist = await _context.Watchlists.Include(c => c.Coins).FirstOrDefaultAsync(apu => apu.ApplicationUserId == _userAuthService.getCurrentUserId());

            if (watchlist == null)
            {
                watchlist = new Watchlist();
                //TODO: Add IDs based on claims
                watchlist.Id = 0;
                watchlist.ApplicationUserId = _userAuthService.getCurrentUserId();
                watchlist.Coins = new List<Coin>();

                _context.Watchlists.Add(watchlist);

                await _context.SaveChangesAsync();
            }


            return new WatchlistDTO(watchlist, watchlist.ApplicationUserId);
        }

        // GET: api/Watchlists/5
        [EnableQuery]
        [HttpGet("{id}")]
        public async Task<ActionResult<WatchlistDTO>> GetWatchlist([FromRoute] int id)
        {
            if (_context.Watchlists == null)
            {
                return NotFound();
            }
            var watchlist = await _context.Watchlists.FindAsync(id);

            if (watchlist == null)
            {
                return NotFound();
            }

            return new WatchlistDTO(watchlist, watchlist.ApplicationUserId);
        }

        // PUT: api/Watchlists/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        /*[EnableQuery]*/
        /*        [HttpPut("{id}")]*/

        [EnableQuery]
        [HttpPut("/odata/Watchlists({id})")]
        public async Task<IActionResult> PutWatchlist(int id, AddCoinToWatchlistRequest addCoinToWatchlistRequest)
        {
            if (_context.Watchlists == null)
            {
                return NotFound();
            }

            if (_userAuthService.getCurrentUserId() == null)
            {
                return Unauthorized();
            }



            Watchlist? watchlist = await _context.Watchlists.Include(c => c.Coins).FirstOrDefaultAsync(x => x.Id == id);

            if (id != watchlist.Id)
            {
                return BadRequest();
            }

            Coin coins = _context.Coins.Find(addCoinToWatchlistRequest.CoinSymbol.ToString());

       
            if (coins == null)
            {

                Coin coin = new Coin();

                coin.Symbol = addCoinToWatchlistRequest.CoinSymbol.ToString();

                _context.Coins.Add(coin);
                await _context.SaveChangesAsync();

                coins = coin;

            }

            bool deleteWatchlistCoin = watchlist.Coins.Any(item => item.Symbol == coins.Symbol);

            if (deleteWatchlistCoin == true)
            {
                watchlist.Coins.Remove(coins);

            }
            if (deleteWatchlistCoin == false)
            {

                watchlist.Coins.Add(coins);
            }

            _context.Entry(watchlist).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!WatchlistExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Ok(watchlist);
        }

        /*        [EnableQuery]
                [HttpPut("/odata/Watchlists({id})")]
                public async Task<IActionResult> PutWatchlist(int id, WatchlistDTO watchlistDTO)
                {
                    if (_context.Watchlists == null)
                    {
                        return NotFound();
                    }

                    if (_userAuthService.getCurrentUserId() == null)
                    {
                        return Unauthorized();
                    }

                    Watchlist? watchlist = await _context.Watchlists.Include(c => c.Coins).FirstOrDefaultAsync(x => x.Id == id);


                    watchlist.Coins.Clear();




                    if (id != watchlist.Id)
                    {
                        return BadRequest();
                    }

                    watchlist.Id = watchlistDTO.Id;
                    watchlist.ApplicationUserId = watchlistDTO.ApplicationUserId;
                    if (watchlistDTO.Coins != null)
                    {
                    }

                    _context.Entry(watchlist).State = EntityState.Modified;

                    try
                    {
                        await _context.SaveChangesAsync();
                    }
                    catch (DbUpdateConcurrencyException)
                    {
                        if (!WatchlistExists(id))
                        {
                            return NotFound();
                        }
                        else
                        {
                            throw;
                        }
                    }

                    return Ok(watchlistDTO);
                }*/

        [EnableQuery]
        [HttpPatch("{key}")]
        public async Task<IActionResult> Patch([FromODataUri] int key, Delta<WatchlistDTO> watchistDTO)
        {
            //Check is User Authorized to view this building
            if (_userAuthService.getCurrentUserId == null)
            {
                return Unauthorized();
            }
            if (_context.Watchlists == null)
            {
                return Problem("Entity set 'ApplicationDbContext.Watchlists'  is null.");
            }
            var entity = await _context.Watchlists.FindAsync(key);

            if (entity == null)
            {
                return NotFound();
            }

            Delta<Watchlist> deltaWatchlist = WatchlistDTO.toDeltaWatchlist(watchistDTO);

            deltaWatchlist.Patch(entity);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!WatchlistExists(key))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }
            return Updated(entity);
        }

        // POST: api/Watchlists
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [EnableQuery]
        [HttpPost("/odata/Watchlists")]
        public async Task<ActionResult<WatchlistDTO>> PostTicket(WatchlistDTO watchlistDTO)
        {


            if (_context.Watchlists == null)
            {
                return Problem("Entity set 'ApplicationDbContext.Tickets'  is null.");
            }

            //Check is User Authorized 
            if (_userAuthService.getCurrentUserId == null)
            {
                return Unauthorized();
            }


            Watchlist watchlist = watchlistDTO.convertToWatchlist();
            //TODO: Add IDs based on claims
            watchlist.Id = 0;
            watchlist.ApplicationUserId = _userAuthService.getCurrentUserId();
            watchlist.Coins = new List<Coin>();

            _context.Watchlists.Add(watchlist);

            await _context.SaveChangesAsync();

            return CreatedAtAction("GetWatchlist", new { id = watchlist.Id }, watchlist);

        }

        // DELETE: api/Watchlists/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteWatchlist(int id)
        {
            //Check is User Authorized 
            if (_userAuthService.getCurrentUserId == null)
            {
                return Unauthorized();
            }

            if (_context.Watchlists == null)
            {
                return NotFound();
            }
            var watchlist = await _context.Watchlists.FindAsync(id);
            if (watchlist == null)
            {
                return NotFound();
            }

            _context.Watchlists.Remove(watchlist);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool WatchlistExists(int id)
        {
            return (_context.Watchlists?.Any(e => e.Id == id)).GetValueOrDefault();
        }
    }
}
