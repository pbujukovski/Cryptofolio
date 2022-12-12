using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Cryptofolio.Data;
using Cryptofolio.Models;
using Cryptofolio.Services;
using Microsoft.AspNetCore.OData.Query;
using Cryptofolio.ViewModels;
using Microsoft.AspNetCore.OData.Deltas;
using Microsoft.AspNetCore.OData.Formatter;
using Microsoft.AspNetCore.OData.Routing.Controllers;

namespace Cryptofolio.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CoinsController : ODataController
    {
        private readonly ApplicationDbContext _context;
        private readonly IUserAuthService _userAuthService;

        public CoinsController(ApplicationDbContext context, IUserAuthService userAuthService)
        {
            _context = context;
            _userAuthService = userAuthService;
        }

        // GET: api/Coins
        [EnableQuery]
        [HttpGet("/odata/Coins")]
        public ActionResult<IEnumerable<CoinDTO>> GetCoins()
        {
          if (_context.Coins == null && _userAuthService.getCurrentUserId == null)
          {
              return NotFound();
          }
          else if (_context.Coins != null && _userAuthService.getCurrentUserId() != null)
          {
              List<CoinDTO> coins  = _context.Coins.Select(c => new CoinDTO(c, _userAuthService.getCurrentUserId())).ToList();
              return Ok(coins);
          }
          else return BadRequest();
        }

        // GET: api/Coins/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Coin>> GetCoin(string id)
        {
          if (_context.Coins == null)
          {
              return NotFound();
          }
            var coin = await _context.Coins.FindAsync(id);

            if (coin == null)
            {
                return NotFound();
            }

            return coin;
        }

        // PUT: api/Coins/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [EnableQuery]
        [HttpPut("{id}")]
        public async Task<IActionResult> PutCoin(string id, CoinDTO coinDTO)
        {

            if (_context.Coins == null && _userAuthService.getCurrentUserId() == null)
            {
                return NotFound();
            }

            Coin? coin = await _context.Coins.FirstOrDefaultAsync(x => x.Symbol == id);


            if (coin != null)
            {
                if (id != coin.Symbol)
                {
                    return BadRequest();
                }

                coin.Symbol = coinDTO.Symbol;
                

                _context.Entry(coin).State = EntityState.Modified;

                try
                {
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!CoinExists(id))
                    {
                        return NotFound();
                    }
                    else
                    {
                        throw;
                    }
                }
            }
            return NoContent();
        }

        [HttpPatch("{key}")]
        public async Task<IActionResult> Patch([FromODataUri] string key, Delta<CoinDTO> coinDTO)
        {
            if (_context.Coins == null)
            {
                return Problem("Entity set 'ApplicationDbContext.Coins'  is null.");
            }
            if (_userAuthService.getCurrentUserId() is null)
            {
                return Problem("Access denied");
            }

            var entity = await _context.Coins.FindAsync(key);

            if (entity == null)
            {
                return NotFound();
            }


            Delta<Coin> deltaCoin = CoinDTO.toDeltaCoin(coinDTO);

            deltaCoin.Patch(entity);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CoinExists(key))
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

        // POST: api/Coins
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [EnableQuery]
        [HttpPost("/odata/Coins")]
        public async Task<ActionResult<Coin>> PostCoin(CoinDTO coinDTO)
        {
          if (_context.Coins == null)
          {
              return Problem("Entity set 'ApplicationDbContext.Coins'  is null.");
          }

            if (_userAuthService.getCurrentUserId() != null)
            { 
                return Unauthorized();
            }

            Coin coin = coinDTO.convertToCoin();

            
            _context.Coins.Add(coin);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (CoinExists(coin.Symbol))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction("GetCoin", new { id = coin.Symbol }, coin);
        }

        // DELETE: api/Coins/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCoin(string id)
        {
            if (_context.Coins == null)
            {
                return NotFound();
            }
            var coin = await _context.Coins.FindAsync(id);
            if (coin == null)
            {
                return NotFound();
            }

            _context.Coins.Remove(coin);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool CoinExists(string id)
        {
            return (_context.Coins?.Any(e => e.Symbol == id)).GetValueOrDefault();
        }
    }
}
