using Cryptofolio.Data;
using Cryptofolio.Models;
using Cryptofolio.Services;
using Cryptofolio.ViewModels;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OData.Deltas;
using Microsoft.AspNetCore.OData.Formatter;
using Microsoft.AspNetCore.OData.Query;
using Microsoft.AspNetCore.OData.Routing.Controllers;
using Microsoft.EntityFrameworkCore;

namespace Cryptofolio.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TransferTransactionOutsController : ODataController
    {
        private readonly ApplicationDbContext _context;
        private readonly IUserAuthService _userAuthService;

        public TransferTransactionOutsController(ApplicationDbContext context, IUserAuthService userAuthService)
        {
            _context = context;
            _userAuthService = userAuthService;
        }

        // GET: api/TransferTransactionOuts
        [EnableQuery]
        [HttpGet("/odata/TransferTransactionOuts")]
        public ActionResult<List<TransferTransactionOutDTO>> GetTransferTransactionIns()
        {
            if (_context.TransferTransactionOuts == null && _userAuthService.getCurrentUserId() == null)
            {
                return NotFound();
            }
            else if (_context.TransferTransactionOuts != null && _userAuthService.getCurrentUserId() != null)
            {
                List<TransferTransactionOutDTO> transferTransactionOuts = _context.TransferTransactionOuts.Where(cs => cs.ApplicationUserId == _userAuthService.getCurrentUserId()).Include(c => c.ApplicationUser).Select(transferTransactionOuts => new TransferTransactionOutDTO(transferTransactionOuts)).ToList();
                return Ok(transferTransactionOuts);
            }
            else return BadRequest();
        }

        // GET: api/TransferTransactionOuts/5
        [HttpGet("{id}")]
        public async Task<ActionResult<TransferTransactionOut>> GetTransferTransactionOuts(int id)
        {
            if (_context.TransferTransactionOuts == null)
            {
                return NotFound();
            }
            var transferTransactionOut = await _context.TransferTransactionOuts.FindAsync(id);

            if (transferTransactionOut == null)
            {
                return NotFound();
            }

            return transferTransactionOut;
        }

        // PUT: api/TransferTransactionOuts/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [EnableQuery]
        [HttpPut("{id}")]
        public async Task<IActionResult> PutTransferTransactionOut(int id, [FromODataBody] TransferTransactionOutDTO transferTransactionOutDTO)
        {
            TransferTransactionOut? transferTransactionOut = await _context.TransferTransactionOuts.FirstOrDefaultAsync(x => x.Id == id);

            if (transferTransactionOut == null)
            {
                if (id != transferTransactionOut.Id)
                {
                    return BadRequest();
                }
                transferTransactionOut.Id = transferTransactionOutDTO.Id;

                transferTransactionOut.ApplicationUserId = transferTransactionOutDTO.ApplicationUserId;

                _context.Entry(transferTransactionOut).State = EntityState.Modified;

                try
                {
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!TransferTransactionOutsExists(id))
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
        public async Task<IActionResult> Patch([FromODataUri] int key, Delta<TransferTransactionOutDTO> transferTransactionOutDTO)
        {
            if (_context.TransferTransactionOuts == null)
            {
                return Problem("Entity set 'ApplicationDbContext.TransferTransactionOuts'  is null.");
            }
            if (_userAuthService.getCurrentUserId() is null)
            {
                return Problem("Access denied");
            }

            var entity = await _context.TransferTransactionOuts.FindAsync(key);

            if (entity == null)
            {
                return NotFound();
            }


            Delta<TransferTransactionOut> deltaTransferTransactionOut = TransferTransactionOutDTO.toDeltaTransferTransactionOut(transferTransactionOutDTO);

            deltaTransferTransactionOut.Patch(entity);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TransferTransactionOutsExists(key))
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

        // POST: api/FinanceTransactionBuys
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [EnableQuery]
        [HttpPost("/odata/TransferTransactionOuts")]
        public async Task<ActionResult<TransferTransactionOut>> PostTransferTransactionOut(TransferTransactionOutDTO transferTransactionOutDTO)
        {
            if (_context.TransferTransactionOuts == null)
            {
                return Problem("Entity set 'ApplicationDbContext.TransferTransactionOuts'  is null.");
            }


            else if (_userAuthService.getCurrentUserId() != null)
            {


                Coin? coins = _context.Coins?.Find(transferTransactionOutDTO.CoinSymbol.ToString());

                if (coins == null)
                {

                    Coin coin = new Coin();

                    coin.Symbol = transferTransactionOutDTO.CoinSymbol.ToString();

                    _context.Coins.Add(coin);
                    await _context.SaveChangesAsync();
                }



                TransferTransactionOut transferTransactionOut = transferTransactionOutDTO.convertToTransferTransactionOut();
                //TODO: Add IDs based on claims


                transferTransactionOut.ApplicationUserId = _userAuthService.getCurrentUserId();
                transferTransactionOut.Id = 0;
                _context.TransferTransactionOuts.Add(transferTransactionOut);
                await _context.SaveChangesAsync();

                transferTransactionOutDTO.Id = transferTransactionOut.Id;
                transferTransactionOutDTO.ApplicationUserId = transferTransactionOut.ApplicationUserId;

                return CreatedAtAction("GetTransferTransactionOut", new { id = transferTransactionOutDTO.Id }, transferTransactionOutDTO);
            }
            else
            {
                return BadRequest();
            }
        }

        // DELETE: api/TransferTransactionOuts/5
        [EnableQuery]
        [HttpDelete("/odata/TransferTransactionOuts({id})")]
        public async Task<IActionResult> DeleteTransferTransactionOuts(int id)
        {
            if (_context.TransferTransactionOuts == null)
            {
                return NotFound();
            }
            var transferTransactionOut = await _context.TransferTransactionOuts.FindAsync(id);
            if (transferTransactionOut == null)
            {
                return NotFound();
            }

            _context.TransferTransactionOuts.Remove(transferTransactionOut);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool TransferTransactionOutsExists(int id)
        {
            return (_context.TransferTransactionOuts?.Any(e => e.Id == id)).GetValueOrDefault();
        }
    }
}
